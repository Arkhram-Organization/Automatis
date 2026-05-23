"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useLang } from "@/hooks/useLang";

type TermLine = { type: "system" | "input" | "output" | "error" | "success"; text: string };

const COPY = {
  es: {
    pre: "── AUTOMATIS / CANAL DE ACCESO ──",
    headline: "CONTACTO",
    cta: "Nos vamos a poner en contacto para coordinar una reunión personalizada donde analizamos tu necesidad y diseñamos la solución desde cero.",
    ctaSub: "No plantillas. No paquetes genéricos. Cada proyecto empieza con una conversación real.",
    form: {
      name: "NOMBRE / ALIAS",
      email: "EMAIL DE RESPUESTA",
      msg: "MENSAJE",
      namePh: "tu nombre o empresa",
      emailPh: "tu@email.com",
      msgPh: "Contanos qué querés construir.",
      send: "⟶  TRANSMITIR",
      sending: "ENVIANDO...",
      sent: "✓  MENSAJE RECIBIDO",
      retry: "⟶  REINTENTAR",
    },
    channels: { label: "CANALES DIRECTOS", linkedin: "LinkedIn", email: "Email" },
    initLines: [
      { type: "system" as const, text: "AUTOMATIS RELAY v2.6 — CANAL SEGURO" },
      { type: "system" as const, text: "Estableciendo conexión cifrada..." },
      { type: "output" as const, text: "Conexión establecida. Verificación: PENDIENTE." },
      { type: "output" as const, text: "Ingresá tu mensaje en los campos de abajo." },
    ],
    successLine: "✓ Transmisión recibida. Automatis responderá por canales seguros.",
    errorLine: "ERROR DE RELAY: Falló la transmisión. Contactá vía LinkedIn.",
    note: "Respondemos en menos de 24h. Si el proyecto es real, la conversación también.",
  },
  en: {
    pre: "── AUTOMATIS / ACCESS CHANNEL ──",
    headline: "CONTACT",
    cta: "We'll reach out to schedule a personalized meeting where we analyze your needs and design the solution from scratch.",
    ctaSub: "No templates. No generic packages. Every project starts with a real conversation.",
    form: {
      name: "NAME / ALIAS",
      email: "RETURN CHANNEL",
      msg: "MESSAGE",
      namePh: "your name or company",
      emailPh: "your@email.com",
      msgPh: "Tell us what you want to build.",
      send: "⟶  TRANSMIT",
      sending: "ROUTING...",
      sent: "✓  TRANSMISSION RECEIVED",
      retry: "⟶  RETRY TRANSMISSION",
    },
    channels: { label: "DIRECT CHANNELS", linkedin: "LinkedIn", email: "Email" },
    initLines: [
      { type: "system" as const, text: "AUTOMATIS COMMUNICATION RELAY v2.6 — SECURE CHANNEL" },
      { type: "system" as const, text: "Establishing encrypted connection..." },
      { type: "output" as const, text: "Connection established. Identity verification: PENDING." },
      { type: "output" as const, text: "Enter your message in the fields below." },
    ],
    successLine: "✓ Transmission received. Automatis will respond through secure channels.",
    errorLine: "RELAY ERROR: Transmission failed. Contact via LinkedIn.",
    note: "We respond within 24h. If the project is real, so is the conversation.",
  },
};

const ENTITIES = [
  {
    handle: "TROSMAN",
    name: "Theo Trosman",
    role: "Backend Architect",
    linkedin: "https://www.linkedin.com/in/theotrosman/",
    email: "theotrosman@gmail.com",
  },
  {
    handle: "CALVIÑO",
    name: "Sebastián Calviño",
    role: "Systems Architect",
    linkedin: "https://www.linkedin.com/in/sebasti%C3%A1n-calvi%C3%B1o-99073b302/",
    email: "sebaacalvino@gmail.com",
  },
];

const inputStyle = (focused: boolean): React.CSSProperties => ({
  background: "transparent",
  border: "none",
  borderBottom: `1px solid ${focused ? "rgba(139,26,26,0.5)" : "rgba(255,255,255,0.07)"}`,
  outline: "none",
  color: "#d4c9b8",
  fontFamily: "monospace",
  fontSize: "0.68rem",
  letterSpacing: "0.04em",
  padding: "0.5rem 0",
  width: "100%",
  transition: "border-color 0.3s ease",
  caretColor: "#8b1a1a",
});

export function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-8% 0px" });
  const lang = useLang();
  const c = COPY[lang];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [lines, setLines] = useState<TermLine[]>(c.initLines);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [focused, setFocused] = useState<string | null>(null);

  const pushLine = (line: TermLine) => setLines((l) => [...l, line]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !msg) {
      pushLine({ type: "error", text: lang === "es" ? "ERROR: Todos los campos son requeridos." : "ERROR: All fields required." });
      return;
    }
    setStatus("sending");
    pushLine({ type: "input", text: `> TRANSMIT name="${name}" email="${email}"` });
    pushLine({ type: "system", text: lang === "es" ? "Cifrando payload... enrutando por relay Automatis..." : "Encrypting payload... routing through Automatis relay..." });
    try {
      const res = await fetch("https://formspree.io/f/xpwzpapq", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message: msg }),
      });
      if (res.ok) {
        pushLine({ type: "success", text: c.successLine });
        setStatus("sent");
        setName(""); setEmail(""); setMsg("");
      } else {
        throw new Error("relay_rejected");
      }
    } catch {
      pushLine({ type: "error", text: c.errorLine });
      setStatus("error");
    }
  };

  return (
    <section ref={ref} style={{ position: "relative", overflow: "hidden", padding: "10rem 0" }}>
      <div className="animate-fog-slow" style={{ position: "absolute", inset: "-20%", background: "radial-gradient(ellipse 70% 50% at 70% 50%, rgba(14,2,2,0.65) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "1100px", margin: "0 auto", padding: "0 2rem", position: "relative", zIndex: 5 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.9 }}
          style={{ marginBottom: "3rem" }}
        >
          <div style={{ fontFamily: "monospace", fontSize: "0.55rem", letterSpacing: "0.55em", color: "rgba(139,26,26,0.45)", marginBottom: "0.8rem", textTransform: "uppercase" }}>
            {c.pre}
          </div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)", fontWeight: 700, letterSpacing: "0.22em", color: "#d0c8bc" }}>
            {c.headline}
          </h2>
        </motion.div>

        {/* CTA Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ borderLeft: "2px solid rgba(139,26,26,0.45)", paddingLeft: "2rem", marginBottom: "4rem", maxWidth: "760px" }}
        >
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(0.85rem, 1.8vw, 1.05rem)", fontStyle: "italic", color: "rgba(212,201,184,0.65)", lineHeight: 1.9, letterSpacing: "0.04em", marginBottom: "0.8rem" }}>
            &ldquo;{c.cta}&rdquo;
          </p>
          <p style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(212,201,184,0.22)", letterSpacing: "0.05em", lineHeight: 1.7 }}>
            {c.ctaSub}
          </p>
        </motion.div>

        {/* Two-column: form + channels */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, delay: 0.35 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}
        >
          {/* Left: Form with mini terminal */}
          <form onSubmit={handleSubmit} style={{ background: "rgba(8,4,4,1)", border: "1px solid rgba(255,255,255,0.04)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Window bar */}
            <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
              {["#8b1a1a", "#5a5010", "#1a3a1a"].map((clr, i) => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: clr, opacity: 0.6 }} />
              ))}
              <span style={{ fontFamily: "monospace", fontSize: "0.44rem", letterSpacing: "0.2em", color: "rgba(139,26,26,0.4)", marginLeft: "0.5rem" }}>automatis-relay.sh</span>
            </div>

            {/* Mini log */}
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "0.8rem" }}>
              {lines.slice(-3).map((line, i) => (
                <div key={i} style={{
                  fontFamily: "monospace", fontSize: "0.5rem", lineHeight: 1.55, letterSpacing: "0.02em",
                  color: line.type === "error" ? "rgba(200,50,50,0.8)" : line.type === "success" ? "rgba(80,200,80,0.8)" : line.type === "input" ? "rgba(192,160,96,0.65)" : line.type === "system" ? "rgba(139,26,26,0.5)" : "rgba(212,201,184,0.3)",
                  marginBottom: "0.05rem",
                }}>
                  {line.type === "system" && <span style={{ color: "rgba(139,26,26,0.4)", marginRight: "0.3rem" }}>$</span>}
                  {line.type === "output" && <span style={{ color: "rgba(80,140,80,0.5)", marginRight: "0.3rem" }}>›</span>}
                  {line.text}
                </div>
              ))}
            </div>

            <div>
              <label style={{ fontFamily: "monospace", fontSize: "0.46rem", letterSpacing: "0.3em", color: "rgba(139,26,26,0.45)", display: "block", marginBottom: "0.5rem", textTransform: "uppercase" }}>{c.form.name}</label>
              <input value={name} onChange={(e) => setName(e.target.value)} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} placeholder={c.form.namePh} style={inputStyle(focused === "name")} />
            </div>

            <div>
              <label style={{ fontFamily: "monospace", fontSize: "0.46rem", letterSpacing: "0.3em", color: "rgba(139,26,26,0.45)", display: "block", marginBottom: "0.5rem", textTransform: "uppercase" }}>{c.form.email}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} placeholder={c.form.emailPh} style={inputStyle(focused === "email")} />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontFamily: "monospace", fontSize: "0.46rem", letterSpacing: "0.3em", color: "rgba(139,26,26,0.45)", display: "block", marginBottom: "0.5rem", textTransform: "uppercase" }}>{c.form.msg}</label>
              <textarea value={msg} onChange={(e) => setMsg(e.target.value)} onFocus={() => setFocused("msg")} onBlur={() => setFocused(null)} placeholder={c.form.msgPh} rows={5}
                style={{ ...inputStyle(focused === "msg"), borderBottom: "none", border: `1px solid ${focused === "msg" ? "rgba(139,26,26,0.4)" : "rgba(255,255,255,0.05)"}`, resize: "none", padding: "0.7rem" }} />
            </div>

            <motion.button type="submit" disabled={status === "sending" || status === "sent"}
              whileHover={status === "idle" || status === "error" ? { scale: 1.01 } : {}}
              whileTap={status === "idle" || status === "error" ? { scale: 0.99 } : {}}
              className="btn-gothic"
              style={{ padding: "0.85rem 1.5rem", fontSize: "0.6rem", letterSpacing: "0.25em", cursor: status === "sending" || status === "sent" ? "not-allowed" : "pointer", opacity: status === "sent" ? 0.5 : 1, width: "100%" }}
            >
              {status === "idle" && c.form.send}
              {status === "sending" && c.form.sending}
              {status === "sent" && c.form.sent}
              {status === "error" && c.form.retry}
            </motion.button>
          </form>

          {/* Right: Direct channels */}
          <div style={{ background: "#030303", border: "1px solid rgba(139,26,26,0.12)", borderLeft: "none", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.8rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ fontFamily: "monospace", fontSize: "0.48rem", letterSpacing: "0.35em", color: "rgba(212,201,184,0.2)", marginBottom: "1.5rem", textTransform: "uppercase" }}>
                / {c.channels.label}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {ENTITIES.map((entity) => (
                  <div key={entity.handle} style={{ borderLeft: "1px solid rgba(139,26,26,0.2)", paddingLeft: "1rem" }}>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.95rem", fontWeight: 600, letterSpacing: "0.12em", color: "#d4c9b8", marginBottom: "0.15rem" }}>
                        {entity.handle}
                      </div>
                      <div style={{ fontFamily: "monospace", fontSize: "0.5rem", letterSpacing: "0.08em", color: "rgba(192,160,96,0.4)" }}>
                        {entity.role}
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                      <a href={entity.linkedin} target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "monospace", fontSize: "0.54rem", color: "rgba(192,160,96,0.45)", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(192,160,96,0.9)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(192,160,96,0.45)")}
                      >
                        <span style={{ color: "rgba(139,26,26,0.5)" }}>→</span>
                        <span>{c.channels.linkedin} / {entity.name}</span>
                      </a>
                      <a href={`mailto:${entity.email}`}
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "monospace", fontSize: "0.54rem", color: "rgba(192,160,96,0.45)", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(192,160,96,0.9)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(192,160,96,0.45)")}
                      >
                        <span style={{ color: "rgba(139,26,26,0.5)" }}>→</span>
                        <span>{entity.email}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ position: "relative", zIndex: 2, borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "1.2rem", marginTop: "auto" }}>
              <p style={{ fontFamily: "monospace", fontSize: "0.48rem", color: "rgba(212,201,184,0.15)", lineHeight: 1.8, letterSpacing: "0.04em" }}>
                {c.note}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
