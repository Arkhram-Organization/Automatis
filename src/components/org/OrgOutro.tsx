"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLang } from "@/hooks/useLang";

const COPY = {
  es: {
    pre: "── FIN DE TRANSMISIÓN ──",
    quote: "La arquitectura solo es visible para quienes saben dónde mirar.",
    github: "⟶   ORGANIZACIÓN EN GITHUB",
    builtBy: "Construido por",
    footer: "AUTOMATIS — BUENOS AIRES — 2026",
  },
  en: {
    pre: "── TRANSMISSION_END ──",
    quote: "The architecture is only visible to those who know where to look.",
    github: "⟶   GITHUB ORGANIZATION",
    builtBy: "Built by",
    footer: "AUTOMATIS — BUENOS AIRES — 2026",
  },
};

export function OrgOutro() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-20% 0px" });
  const lang = useLang();
  const c = COPY[lang];

  return (
    <section
      ref={ref}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 2rem",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, #050505 0%, #020202 60%, #000000 100%)",
      }}
    >
      <div className="animate-fog" style={{ position: "absolute", inset: "-20%", background: "radial-gradient(ellipse 100% 60% at 50% 80%, rgba(10,2,2,0.9) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div className="animate-fog-slow" style={{ position: "absolute", inset: "-20%", background: "radial-gradient(ellipse 80% 40% at 30% 20%, rgba(20,4,4,0.5) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* Gothic spires */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", pointerEvents: "none", opacity: 0.05 }}>
        <svg viewBox="0 0 1440 200" preserveAspectRatio="xMidYMax slice" style={{ width: "100%", height: "100%" }}>
          <path d="M0 200 L0 100 L60 60 L120 100 L180 80 L200 60 L220 80 L280 100 L340 70 L360 40 L380 70 L440 100 L500 90 L520 70 L540 90 L600 100 L650 80 L680 50 L710 80 L760 100 L800 200 Z" fill="#d4c9b8" />
          <path d="M800 200 L800 110 L850 85 L900 110 L960 90 L980 65 L1000 90 L1060 110 L1120 80 L1160 45 L1200 80 L1260 110 L1320 90 L1360 70 L1400 90 L1440 110 L1440 200 Z" fill="#d4c9b8" />
        </svg>
      </div>

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: "700px" }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          style={{ fontFamily: "monospace", fontSize: "0.6rem", letterSpacing: "0.5em", color: "rgba(139,26,26,0.4)", marginBottom: "3rem", textTransform: "uppercase" }}
        >
          {c.pre}
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(139,26,26,0.4), rgba(192,160,96,0.2), rgba(139,26,26,0.4), transparent)", marginBottom: "4rem", transformOrigin: "left" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 40, filter: "blur(10px)" }}
          transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1.2rem, 3vw, 1.8rem)", fontWeight: 400, letterSpacing: "0.2em", color: "rgba(212,201,184,0.6)", lineHeight: 1.6, fontStyle: "italic", marginBottom: "2rem" }}>
            &ldquo;{c.quote}&rdquo;
          </h2>
        </motion.div>

        {/* AUTOMATIS watermark */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 2, delay: 1.2 }}
        >
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(3rem, 10vw, 6rem)", fontWeight: 900, letterSpacing: "0.35em", color: "transparent", WebkitTextStroke: "1px rgba(139,26,26,0.25)", marginBottom: "1rem" }}>
            AUTOMATIS
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, delay: 1.5 }}
          style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(139,26,26,0.4), rgba(192,160,96,0.2), rgba(139,26,26,0.4), transparent)", marginBottom: "4rem", transformOrigin: "right" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, delay: 1.8 }}
          style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "4rem" }}
        >
          <a
            href="https://github.com/Automatis-Organization"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gothic"
            style={{ padding: "0.7rem 1.8rem", fontSize: "0.62rem", textDecoration: "none", display: "inline-block" }}
          >
            {c.github}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 2, delay: 2.2 }}
          style={{ display: "flex", flexDirection: "column", gap: "0.4rem", alignItems: "center" }}
        >
          <div style={{ fontFamily: "monospace", fontSize: "0.55rem", letterSpacing: "0.3em", color: "rgba(139,26,26,0.3)", textTransform: "uppercase" }}>
            {c.builtBy}
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            {["@sebacalvino", "@theotrosman"].map((handle) => (
              <a
                key={handle}
                href={`https://github.com/${handle.slice(1)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: "monospace", fontSize: "0.6rem", letterSpacing: "0.05em", color: "rgba(192,160,96,0.35)", textDecoration: "none", transition: "color 0.2s ease" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(192,160,96,0.7)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(192,160,96,0.35)")}
              >
                {handle}
              </a>
            ))}
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "0.5rem", letterSpacing: "0.2em", color: "rgba(212,201,184,0.12)", marginTop: "1rem" }}>
            {c.footer}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
