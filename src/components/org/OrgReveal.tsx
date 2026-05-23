"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLang } from "@/hooks/useLang";

const COPY = {
  es: {
    pre: "── AUTOMATIS / REGISTRO DEL SISTEMA ──",
    headline: "NO UN EQUIPO.",
    manifesto: "Automatis es un sistema de creencias con un historial de commits. Un organismo digital clandestino que construye lo que el problema demanda — y nada más.",
    directives: [
      { label: "CONSTRUIR", text: "Sistemas que sobrevivan al problema que los requirió." },
      { label: "OPERAR", text: "En la señal. No en el ruido. No en la tendencia." },
      { label: "DEJAR", text: "Arquitectura donde otros dejan prototipos." },
    ],
    quote: "La señal no siempre es visible. Pero siempre está presente.",
    meta: [
      { key: "CLASE", value: "ORGANISMO DIGITAL" },
      { key: "ESTADO", value: "ACTIVO" },
      { key: "FUNDADO", value: "2026 / BUENOS AIRES" },
      { key: "ENTIDADES", value: "02 / OPERATIVAS" },
      { key: "ARTEFACTOS", value: "03 / CLASIFICADOS" },
    ],
  },
  en: {
    pre: "── AUTOMATIS / SYSTEM RECORD ──",
    headline: "NOT A TEAM.",
    manifesto: "Automatis is a belief system with a commit history. A clandestine digital organism that builds what the problem demands — and nothing else.",
    directives: [
      { label: "BUILD", text: "Systems that outlive the problem that required them." },
      { label: "OPERATE", text: "In the signal. Not the noise. Not the trend." },
      { label: "LEAVE", text: "Architecture where others leave prototypes." },
    ],
    quote: "The signal is not always visible. But it is always present.",
    meta: [
      { key: "CLASS", value: "DIGITAL ORGANISM" },
      { key: "STATUS", value: "ACTIVE" },
      { key: "ESTABLISHED", value: "2026 / BUENOS AIRES" },
      { key: "ENTITIES", value: "02 / OPERATIONAL" },
      { key: "ARTIFACTS", value: "03 / CLASSIFIED" },
    ],
  },
};

export function OrgReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-10% 0px" });
  const lang = useLang();
  const c = COPY[lang];

  return (
    <section
      ref={ref}
      style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "10rem 2rem", position: "relative", overflow: "hidden" }}
    >
      <div className="animate-fog-slow" style={{ position: "absolute", inset: "-20%", background: "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(18,3,3,0.75) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "860px", margin: "0 auto", position: "relative", zIndex: 5 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
          style={{ fontFamily: "monospace", fontSize: "0.55rem", letterSpacing: "0.55em", color: "rgba(139,26,26,0.45)", marginBottom: "3.5rem", textTransform: "uppercase" }}
        >
          {c.pre}
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
          {/* Left: manifesto */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
              animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 30, filter: "blur(12px)" }}
              transition={{ duration: 1.3, ease: "easeOut" }}
              style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)", fontWeight: 700, letterSpacing: "0.22em", color: "#d0c8bc", marginBottom: "0.8rem", lineHeight: 1.15 }}
            >
              {c.headline}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              style={{ fontFamily: "monospace", fontSize: "0.68rem", color: "rgba(212,201,184,0.3)", lineHeight: 1.9, letterSpacing: "0.03em", marginBottom: "2.5rem", maxWidth: "360px" }}
            >
              {c.manifesto}
            </motion.p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {c.directives.map((d, i) => (
                <motion.div
                  key={d.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.8, delay: 0.6 + i * 0.15 }}
                  style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}
                >
                  <span style={{ fontFamily: "monospace", fontSize: "0.52rem", letterSpacing: "0.18em", color: "rgba(139,26,26,0.65)", paddingTop: "0.1rem", flexShrink: 0, minWidth: "5rem" }}>
                    {d.label}
                  </span>
                  <span style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(212,201,184,0.4)", lineHeight: 1.65, letterSpacing: "0.02em" }}>
                    {d.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: classified dossier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ background: "#030303", border: "1px solid rgba(139,26,26,0.12)", padding: "1.8rem", position: "relative", overflow: "hidden" }}
          >
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)", pointerEvents: "none", zIndex: 1 }} />

            <div style={{ position: "relative", zIndex: 2, borderBottom: "1px solid rgba(139,26,26,0.1)", paddingBottom: "1rem", marginBottom: "1.4rem" }}>
              <div style={{ display: "flex", gap: "0.35rem", marginBottom: "0.7rem" }}>
                {["#8b1a1a", "#5a5010", "#1a3a1a"].map((clr, i) => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: clr, opacity: 0.6 }} />
                ))}
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "0.48rem", letterSpacing: "0.3em", color: "rgba(139,26,26,0.45)", textTransform: "uppercase" }}>
                SYSTEM RECORD / ARK-00
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              style={{ position: "relative", zIndex: 2, marginBottom: "1.8rem" }}
            >
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.2em", color: "rgba(212,201,184,0.7)", marginBottom: "0.3rem" }}>
                AUTOMATIS
              </div>
              <div style={{ background: "rgba(139,26,26,0.2)", height: "0.85rem", width: "70%", display: "flex", alignItems: "center", paddingLeft: "0.3rem" }}>
                <span style={{ fontFamily: "monospace", fontSize: "0.42rem", letterSpacing: "0.1em", color: "rgba(139,26,26,0.6)" }}>
                  ████████████████████████
                </span>
              </div>
            </motion.div>

            <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              {c.meta.map((m, i) => (
                <motion.div
                  key={m.key}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.6 }}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "0.5rem" }}
                >
                  <span style={{ fontFamily: "monospace", fontSize: "0.48rem", letterSpacing: "0.18em", color: "rgba(212,201,184,0.2)", textTransform: "uppercase" }}>{m.key}</span>
                  <span style={{ fontFamily: "monospace", fontSize: "0.52rem", letterSpacing: "0.1em", color: "rgba(192,160,96,0.5)" }}>{m.value}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.15 } : { opacity: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              style={{ position: "absolute", bottom: 16, right: 16, fontFamily: "'Cinzel', serif", fontSize: "2.2rem", fontWeight: 900, letterSpacing: "0.1em", color: "transparent", WebkitTextStroke: "1px rgba(139,26,26,0.8)", transform: "rotate(-15deg)", zIndex: 2, pointerEvents: "none" }}
            >
              ARK
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.2, duration: 1.5 }}
          style={{ marginTop: "4rem", textAlign: "center" }}
        >
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.72rem", fontStyle: "italic", color: "rgba(192,160,96,0.3)", letterSpacing: "0.06em" }}>
            &ldquo;{c.quote}&rdquo;
          </p>
        </motion.div>
      </div>
    </section>
  );
}
