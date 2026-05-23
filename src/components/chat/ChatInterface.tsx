"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage, ThinkingIndicator } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { SkillChips } from "./SkillChips";
import { OnboardingModal } from "./OnboardingModal";
import { AutomationConfig, ChatMessage as ChatMessageType } from "@/lib/types";

interface UserProfile {
  id?: string;
  name?: string | null;
  business_type?: string | null;
  business_description?: string | null;
  industry?: string | null;
  ai_notes?: string | null;
  onboarding_done?: boolean;
}

interface ChatInterfaceProps {
  onAutomationCreated?: () => void;
  activeSessionId?: string | null;
  onSessionCreated?: (id: string) => void;
  injectedPrompt?: string | null;
  onInjectedPromptConsumed?: () => void;
}

export function ChatInterface({
  onAutomationCreated,
  activeSessionId,
  onSessionCreated,
  injectedPrompt,
  onInjectedPromptConsumed,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Load session history when activeSessionId changes
  useEffect(() => {
    if (!activeSessionId) {
      setMessages([]);
      setCurrentSessionId(null);
      return;
    }
    setCurrentSessionId(activeSessionId);
    fetch(`/api/chat-sessions/messages?session_id=${activeSessionId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.messages) {
          setMessages(data.messages.map((m: { role: string; content: string }) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })));
        }
      })
      .catch(() => {});
  }, [activeSessionId]);

  // Inject prompt from Skills
  useEffect(() => {
    if (injectedPrompt) {
      setInput(injectedPrompt);
      onInjectedPromptConsumed?.();
    }
  }, [injectedPrompt, onInjectedPromptConsumed]);

  // Helper: ensure a session exists, create one if needed
  async function ensureSession(firstMessage: string): Promise<string | null> {
    if (currentSessionId) return currentSessionId;
    try {
      const title = firstMessage.slice(0, 60) || "Nueva conversación";
      const res = await fetch("/api/chat-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      const id = data.session?.id;
      setCurrentSessionId(id);
      onSessionCreated?.(id);
      return id;
    } catch {
      return null;
    }
  }

  // Helper: save a single message to DB
  async function persistMessage(sessionId: string, role: string, content: string) {
    try {
      await fetch("/api/chat-sessions/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, role, content }),
      });
    } catch {}
  }

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/user-profile");
        if (res.status === 401) { setProfileLoaded(true); return; }
        const data = await res.json();
        if (data.profile) {
          setUserProfile(data.profile);
          if (!data.profile.onboarding_done) setShowOnboarding(true);
        } else {
          setShowOnboarding(true);
        }
      } catch {
        // silently fail
      } finally {
        setProfileLoaded(true);
      }
    }
    loadProfile();
  }, []);

  async function handleOnboardingComplete(data: {
    name: string;
    business_description: string;
    industry: string;
  }) {
    setShowOnboarding(false);
    const updated = { ...userProfile, ...data, onboarding_done: true };
    setUserProfile(updated);
    try {
      const res = await fetch("/api/user-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const json = await res.json();
      if (json.profile) setUserProfile(json.profile);
    } catch {}
  }

  async function saveProfileNote(note: string) {
    if (!note || !userProfile) return;
    const existing = userProfile.ai_notes || "";
    const combined = existing ? `${existing}. ${note}` : note;
    try {
      await fetch("/api/user-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ai_notes: combined }),
      });
      setUserProfile((prev) => (prev ? { ...prev, ai_notes: combined } : prev));
    } catch {}
  }

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading || isStreaming) return;

      const userMessage: ChatMessageType = { role: "user", content };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");
      setIsLoading(true);
      setSuccessMessage(null);

      // Ensure a session exists and persist the user message
      const sessionId = await ensureSession(content);
      if (sessionId) await persistMessage(sessionId, "user", content);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
            userProfile: userProfile
              ? {
                  name: userProfile.name,
                  business_type: userProfile.business_type,
                  business_description: userProfile.business_description,
                  industry: userProfile.industry,
                  ai_notes: userProfile.ai_notes,
                }
              : null,
            stream: true,
          }),
        });

        if (!response.ok || !response.body) {
          throw new Error(`HTTP ${response.status}`);
        }

        // Insert an empty assistant message that we'll fill via streaming
        const assistantIdx = updatedMessages.length;
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
        setIsLoading(false);
        setIsStreaming(true);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        let fullContent = "";
        let automationConfig = null;
        let profileNote: string | null = null;

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const json = JSON.parse(line.slice(6));
              if (json.delta) {
                fullContent += json.delta;
                setMessages((prev) => {
                  const next = [...prev];
                  next[assistantIdx] = { role: "assistant", content: fullContent };
                  return next;
                });
                bottomRef.current?.scrollIntoView({ behavior: "smooth" });
              }
              if (json.done) {
                automationConfig = json.automationConfig;
                profileNote = json.profileNote;
              }
              if (json.error) throw new Error(json.error);
            } catch {
              // skip malformed SSE lines
            }
          }
        }

        setIsStreaming(false);
        // Persist assistant message
        if (sessionId && fullContent) await persistMessage(sessionId, "assistant", fullContent);
        if (profileNote) saveProfileNote(profileNote);
        if (automationConfig) await generateFlow(automationConfig);
      } catch (error) {
        setIsLoading(false);
        setIsStreaming(false);
        console.error("Chat error:", error);
        setMessages((prev) => {
          // Replace blank streaming msg if present, else append
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && last.content === "") {
            const next = [...prev];
            next[next.length - 1] = {
              role: "assistant",
              content: "Error procesando tu mensaje. ¿Podés intentarlo de nuevo?",
            };
            return next;
          }
          return [
            ...prev,
            { role: "assistant", content: "Error procesando tu mensaje. ¿Podés intentarlo de nuevo?" },
          ];
        });
      }
    },
    [messages, isLoading, isStreaming, userProfile]
  );

  async function generateFlow(config: AutomationConfig) {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-flow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });
      const data = await response.json();
      if (!response.ok || !data.automation) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Hubo un error guardando la automatización. ¿Podés intentarlo de nuevo?" },
        ]);
        return;
      }
      setSuccessMessage(
        `Automatización "${data.automation.name}" creada ${
          data.n8nWorkflowId ? "y activada" : "como borrador"
        } exitosamente.`
      );
      onAutomationCreated?.();
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Hubo un error generando la automatización. ¿Podés intentarlo de nuevo?" },
      ]);
    } finally {
      setIsGenerating(false);
    }
  }

  const greeting = userProfile?.name ? `Iniciando, ${userProfile.name}` : "Sistema listo";

  const subgreeting =
    userProfile?.business_description || userProfile?.industry
      ? `¿Qué proceso automatizamos hoy?`
      : "Describí en palabras simples qué querés automatizar.";

  return (
    <>
      {showOnboarding && profileLoaded && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}

      <div className="flex flex-col h-full" style={{ background: "#050202" }}>
        {!hasMessages ? (
          /* ── EMPTY STATE ── */
          <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4 py-12">
            <div className="text-center space-y-3">
              <p
                className="font-mono text-[10px] tracking-[0.3em] uppercase"
                style={{ color: "#8b1a1a" }}
              >
                / AUTOMATIS OS
              </p>
              <h2
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(20px, 3vw, 28px)",
                  color: "#d4c9b8",
                  letterSpacing: "0.05em",
                  fontWeight: 700,
                }}
              >
                {greeting}
              </h2>
              <p className="font-mono text-[11px] max-w-sm" style={{ color: "#3a3530" }}>
                {subgreeting}
              </p>
            </div>

            <div className="w-full max-w-2xl space-y-4">
              <ChatInput
                value={input}
                onChange={setInput}
                onSubmit={() => sendMessage(input)}
                disabled={isLoading || isStreaming}
                placeholder="Describí qué querés automatizar..."
              />
              <SkillChips onSelect={(prompt) => sendMessage(prompt)} />
            </div>
          </div>
        ) : (
          <>
            {/* ── MESSAGE LIST ── */}
            <div
              className="flex-1 overflow-y-auto px-4 py-6"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(139,26,26,0.15) transparent",
              }}
            >
              <div className="max-w-2xl mx-auto space-y-5">
                {messages.map((msg, i) => (
                  <ChatMessage
                    key={i}
                    message={msg}
                    isStreaming={
                      isStreaming &&
                      i === messages.length - 1 &&
                      msg.role === "assistant"
                    }
                  />
                ))}

                {/* Thinking indicator (shown before first stream token arrives) */}
                {isLoading && <ThinkingIndicator />}

                {/* Flow generation indicator */}
                {isGenerating && (
                  <div
                    className="flex items-center gap-3 font-mono text-[11px] justify-center py-3 mx-auto"
                    style={{
                      border: "1px solid rgba(139,26,26,0.2)",
                      background: "rgba(10,5,5,0.7)",
                      color: "#8b1a1a",
                      maxWidth: "320px",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: "#8b1a1a" }}
                    />
                    <span>Compilando automatización en n8n...</span>
                  </div>
                )}

                {/* Success message */}
                {successMessage && (
                  <div
                    className="flex items-center gap-3 font-mono text-[11px] px-4 py-3"
                    style={{
                      borderLeft: "2px solid rgba(106,138,90,0.6)",
                      background: "rgba(74,122,58,0.05)",
                      color: "#6a8a5a",
                    }}
                  >
                    <span style={{ flexShrink: 0 }}>✓</span>
                    <span>{successMessage}</span>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            </div>

            {/* ── INPUT BAR ── */}
            <div
              className="px-4 pb-4 pt-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
            >
              <div className="max-w-2xl mx-auto">
                <ChatInput
                  value={input}
                  onChange={setInput}
                  onSubmit={() => sendMessage(input)}
                  disabled={isLoading || isGenerating || isStreaming}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
