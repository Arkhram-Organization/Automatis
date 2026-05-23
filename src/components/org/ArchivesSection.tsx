"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useLang } from "@/hooks/useLang";

type Archive = {
  code: string;
  name: string;
  status: "ACTIVE" | "DEPLOYED" | "CLASSIFIED";
  type: string;
  award?: string;
  badge?: string;
  logline: string;
  transmission: string;
  stack: string[];
  authors: string[];
  href: string;
  live?: string;
};

const ARCHIVES: Record<"es" | "en", Archive[]> = {
  es: [
    {
      code: "ARK-001",
      name: "ESCAPE-C137",
      status: "DEPLOYED",
      type: "NARRATIVA / EXPERIENCIA INTERACTIVA",
      award: "GANADOR — MEJOR ESCAPE ROOM / ORT 2025",
      logline: "Escape room full-stack construido desde el multiverso de Rick & Morty. 370 commits. Cuarta pared rota. Puzzles reales dentro de una ficción que quiebra sus propias reglas.",
      transmission: "Despertás dentro de una dimensión que recuerda tu nombre. El portal es real — si podés encontrarlo. Los relojes aquí corren al revés.",
      stack: ["C#", "ASP.NET MVC", "JavaScript", "HTML", "CSS", "Sound Design"],
      authors: ["sebacalvino", "theotrosman"],
      href: "https://github.com/Automatis-Organization/ESCAPE-C137",
    },
    {
      code: "ARK-002",
      name: "CADA LADO NOTICIAS",
      status: "ACTIVE",
      type: "IA / ANÁLISIS DE MEDIOS",
      logline: "Plataforma de síntesis de noticias argentinas. 8 medios del espectro político. 1 resumen neutro generado por IA. La misma noticia, todas las voces.",
      transmission: "Los medios cubren el mismo hecho con énfasis distintos. Este sistema los lee a todos, agrupa las historias relacionadas y genera el análisis que ninguno va a escribir.",
      stack: ["Python", "FastAPI", "Next.js 14", "PostgreSQL", "scikit-learn", "Claude Sonnet"],
      authors: ["sebacalvino"],
      href: "https://github.com/SebaCalvino/Cada-Lado-Noticias",
    },
    {
      code: "ARK-003",
      name: "PROMPTOOL",
      status: "ACTIVE",
      type: "IA / GAMIFICACIÓN",
      badge: "PRÓXIMAMENTE",
      logline: "Una imagen. Un prompt oculto. Reconstruilo. Puntuado por Gemini. Un juego diario donde el modelo juzga tu habilidad para pensar como un modelo.",
      transmission: "La imagen existe. El prompt que la creó fue redactado. Tenés 24 horas antes de que el archivo rote.",
      stack: ["React", "Vite", "Supabase", "Groq", "Gemini API", "Node.js"],
      authors: ["theotrosman"],
      href: "https://github.com/theotrosman/PROMPTOOL",
      live: "https://promptool.vercel.app",
    },
  ],
  en: [
    {
      code: "ARK-001",
      name: "ESCAPE-C137",
      status: "DEPLOYED",
      type: "NARRATIVE / INTERACTIVE EXPERIENCE",
      award: "WINNER — BEST ESCAPE ROOM / ORT 2025",
      logline: "A full-stack escape room built from Rick & Morty's multiverse. 370 commits. Fourth-wall fractures. Real puzzles inside a fiction that breaks its own rules.",
      transmission: "You wake inside a dimension that remembers your name. The portal is real — if you can find it. The clocks here run backwards.",
      stack: ["C#", "ASP.NET MVC", "JavaScript", "HTML", "CSS", "Sound Design"],
      authors: ["sebacalvino", "theotrosman"],
      href: "https://github.com/Automatis-Organization/ESCAPE-C137",
    },
    {
      code: "ARK-002",
      name: "CADA LADO NOTICIAS",
      status: "ACTIVE",
      type: "AI / MEDIA ANALYSIS",
      logline: "Argentine news synthesis platform. 8 outlets across the political spectrum. 1 AI-generated neutral summary. The same story, all voices.",
      transmission: "Media outlets cover the same story with different emphasis. This system reads them all, clusters related stories, and generates the analysis none of them will write.",
      stack: ["Python", "FastAPI", "Next.js 14", "PostgreSQL", "scikit-learn", "Claude Sonnet"],
      authors: ["sebacalvino"],
      href: "https://github.com/SebaCalvino/Cada-Lado-Noticias",
    },
    {
      code: "ARK-003",
      name: "PROMPTOOL",
      status: "ACTIVE",
      type: "AI / GAMIFICATION",
      badge: "LAUNCHING SOON",
      logline: "One image. One hidden prompt. Reconstruct it. Scored by Gemini. A daily game where the model judges your ability to think like a model.",
      transmission: "The image exists. The prompt that created it has been redacted. You have 24 hours before the archive rotates.",
      stack: ["React", "Vite", "Supabase", "Groq", "Gemini API", "Node.js"],
      authors: ["theotrosman"],
      href: "https://github.com/theotrosman/PROMPTOOL",
      live: "https://promptool.vercel.app",
    },
  ],
};

const COPY = {
  es: {
    pre: "── AUTOMATIS / ARCHIVOS CLASIFICADOS ──",
    headline: "LOS ARTEFACTOS",
    sub: "Cada proyecto es evidencia. No de lo que Automatis hace — sino de cómo piensa.\nClick para descifrar.",
    recordsLabel: (n: number) => `REGISTROS: ${n} / ESTADO: PÚBLICO / NIVEL: AUTOMATIS-0`,
    repo: "⟶ REPOSITORIO",
    live: "⟶ INSTANCIA LIVE",
    transmission: "/ transmisión",
    stack: "/ stack",
    operators: "/ operadores",
  },
  en: {
    pre: "── AUTOMATIS / CLASSIFIED ARCHIVES ──",
    headline: "THE ARTIFACTS",
    sub: "Each project is evidence. Not of what Automatis does — but of what it thinks.\nClick to decrypt.",
    recordsLabel: (n: number) => `RECORDS: ${n} / STATUS: PUBLIC / LEVEL: AUTOMATIS-0`,
    repo: "⟶ REPOSITORY",
    live: "⟶ LIVE INSTANCE",
    transmission: "/ transmission",
    stack: "/ stack",
    operators: "/ operators",
  },
};

const STATUS_CONFIG = {
  ACTIVE: { color: "#22c55e", label: "ACTIVE" },
  DEPLOYED: { color: "#c0a060", label: "DEPLOYED" },
  CLASSIFIED: { color: "#8b1a1a", label: "CLASSIFIED" },
};

function ArchiveEntry({ archive, index, copy }: { archive: Archive; index: number; copy: typeof COPY.en }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-8% 0px" });
  const [open, setOpen] = useState(false);
  const [hov, setHov] = useState(false);
  const sc = STATUS_CONFIG[archive.status];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={() => setOpen(!open)}
        animate={{
          borderLeftColor: open ? "rgba(139,26,26,0.7)" : hov ? "rgba(139,26,26,0.35)" : "rgba(255,255,255,0.03)",
          background: open ? "rgba(12,5,5,1)" : hov ? "rgba(9,4,4,1)" : "rgba(7,3,3,1)",
        }}
        transition={{ duration: 0.25 }}
        style={{ borderLeft: "2px solid rgba(255,255,255,0.03)", cursor: "pointer", position: "relative" }}
      >
        {/* Header row */}
        <div style={{ padding: "1.4rem 1.6rem", display: "grid", gridTemplateColumns: "5rem 1fr auto auto auto", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontFamily: "monospace", fontSize: "0.52rem", letterSpacing: "0.18em", color: "rgba(139,26,26,0.45)" }}>{archive.code}</span>
          <div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(0.85rem, 1.8vw, 1.1rem)", fontWeight: 600, letterSpacing: "0.1em", color: "#d4c9b8", marginBottom: "0.12rem" }}>
              {archive.name}
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "0.5rem", letterSpacing: "0.1em", color: "rgba(192,160,96,0.38)", textTransform: "uppercase" }}>
              {archive.type}
            </div>
          </div>

          {archive.award ? (
            <div style={{ fontFamily: "monospace", fontSize: "0.42rem", letterSpacing: "0.1em", color: "rgba(192,160,96,0.75)", border: "1px solid rgba(192,160,96,0.28)", padding: "0.18rem 0.5rem", whiteSpace: "nowrap", textTransform: "uppercase" }}>
              {archive.award}
            </div>
          ) : archive.badge ? (
            <div style={{ fontFamily: "monospace", fontSize: "0.42rem", letterSpacing: "0.1em", color: "rgba(139,200,139,0.75)", border: "1px solid rgba(139,200,139,0.28)", padding: "0.18rem 0.5rem", whiteSpace: "nowrap", textTransform: "uppercase" }}>
              {archive.badge}
            </div>
          ) : <div />}

          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <motion.div animate={{ boxShadow: `0 0 ${hov || open ? "10px" : "5px"} ${sc.color}` }} style={{ width: 5, height: 5, borderRadius: "50%", background: sc.color }} />
            <span style={{ fontFamily: "monospace", fontSize: "0.48rem", letterSpacing: "0.12em", color: sc.color, opacity: 0.85 }}>{sc.label}</span>
          </div>
          <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.25 }} style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "rgba(139,26,26,0.4)" }}>→</motion.span>
        </div>

        {/* Logline always visible */}
        <div style={{ padding: "0 1.6rem 1.2rem", fontFamily: "monospace", fontSize: "0.63rem", color: "rgba(212,201,184,0.3)", lineHeight: 1.75, letterSpacing: "0.02em" }}>
          {archive.logline}
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ padding: "0 1.6rem 2rem", borderTop: "1px solid rgba(139,26,26,0.08)", paddingTop: "1.4rem" }}>
                <div style={{ borderLeft: "1.5px solid rgba(139,26,26,0.3)", paddingLeft: "1rem", marginBottom: "1.4rem" }}>
                  <div style={{ fontFamily: "monospace", fontSize: "0.45rem", letterSpacing: "0.35em", color: "rgba(139,26,26,0.4)", marginBottom: "0.4rem", textTransform: "uppercase" }}>{copy.transmission}</div>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.7rem", fontStyle: "italic", color: "rgba(192,160,96,0.45)", lineHeight: 1.75, letterSpacing: "0.04em" }}>
                    &ldquo;{archive.transmission}&rdquo;
                  </p>
                </div>

                <div style={{ marginBottom: "1.2rem" }}>
                  <div style={{ fontFamily: "monospace", fontSize: "0.45rem", letterSpacing: "0.35em", color: "rgba(212,201,184,0.18)", marginBottom: "0.45rem", textTransform: "uppercase" }}>{copy.stack}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                    {archive.stack.map((t) => (
                      <span key={t} style={{ fontFamily: "monospace", fontSize: "0.5rem", letterSpacing: "0.06em", color: "rgba(212,201,184,0.4)", border: "1px solid rgba(255,255,255,0.05)", padding: "0.12rem 0.4rem" }}>{t}</span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "1.4rem" }}>
                  <div style={{ fontFamily: "monospace", fontSize: "0.45rem", letterSpacing: "0.35em", color: "rgba(212,201,184,0.18)", marginBottom: "0.4rem", textTransform: "uppercase" }}>{copy.operators}</div>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    {archive.authors.map((a) => <span key={a} style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(192,160,96,0.45)" }}>@{a}</span>)}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
                  <a href={archive.href} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="btn-gothic" style={{ padding: "0.5rem 1.1rem", fontSize: "0.55rem", textDecoration: "none", display: "inline-block" }}>
                    {copy.repo}
                  </a>
                  {archive.live && (
                    <a href={archive.live} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="btn-ghost" style={{ padding: "0.5rem 1.1rem", fontSize: "0.55rem", textDecoration: "none", display: "inline-block" }}>
                      {copy.live}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export function ArchivesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-8% 0px" });
  const lang = useLang();
  const c = COPY[lang];
  const archives = ARCHIVES[lang];

  return (
    <section ref={ref} style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "10rem 2rem", position: "relative", overflow: "hidden" }}>
      <div className="animate-fog" style={{ position: "absolute", inset: "-20%", background: "radial-gradient(ellipse 65% 50% at 70% 35%, rgba(14,3,3,0.6) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "860px", margin: "0 auto", position: "relative", zIndex: 5 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.9 }}
          style={{ marginBottom: "3.5rem" }}
        >
          <div style={{ fontFamily: "monospace", fontSize: "0.55rem", letterSpacing: "0.55em", color: "rgba(139,26,26,0.45)", marginBottom: "0.8rem", textTransform: "uppercase" }}>{c.pre}</div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)", fontWeight: 700, letterSpacing: "0.22em", color: "#d0c8bc", marginBottom: "0.6rem" }}>{c.headline}</h2>
          <p style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(212,201,184,0.25)", lineHeight: 1.8, maxWidth: "440px", whiteSpace: "pre-line" }}>{c.sub}</p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {archives.map((a, i) => <ArchiveEntry key={a.code} archive={a} index={i} copy={c} />)}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          style={{ marginTop: "1.8rem", fontFamily: "monospace", fontSize: "0.48rem", letterSpacing: "0.22em", color: "rgba(139,26,26,0.25)", textAlign: "right" }}
        >
          {c.recordsLabel(archives.length)}
        </motion.div>
      </div>
    </section>
  );
}
