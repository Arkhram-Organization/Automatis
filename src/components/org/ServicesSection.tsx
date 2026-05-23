"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useLang } from "@/hooks/useLang";

const COPY = {
  es: {
    pre: "── AUTOMATIS / CAPACIDADES ──",
    headline: "SERVICIOS",
    sub: "No vendemos horas. Resolvemos problemas.\nCada proyecto se diseña desde el problema real, no desde el catálogo.",
    services: [
      {
        id: "SRV-001", cat: "OPERACIONES",
        name: "AUTOMATIZACIÓN DE PROCESOS",
        desc: "Automatización end-to-end de flujos de trabajo reales. Conectamos sistemas, eliminamos fricción y construimos pipelines que operan solos.",
        stack: ["n8n", "Python", "APIs REST", "Webhooks", "Make"],
      },
      {
        id: "SRV-002", cat: "INFRAESTRUCTURA",
        name: "DESARROLLO WEB COMPLETO",
        desc: "Frontend + backend + deploy. Sistemas web que escalan desde el día uno. Arquitectura pensada, sin deuda técnica acumulada.",
        stack: ["Next.js", "React", "Node.js", "Supabase", "PostgreSQL", "Vercel"],
      },
      {
        id: "SRV-003", cat: "PLATAFORMAS",
        name: "APPS MOBILE",
        desc: "Aplicaciones nativas y multiplataforma diseñadas para funcionar en producción. Del wireframe al store.",
        stack: ["React Native", "Expo", "iOS", "Android"],
      },
      {
        id: "SRV-004", cat: "ARQUITECTURA",
        name: "SISTEMAS A MEDIDA",
        desc: "Para negocios que superaron las soluciones genéricas. Diseñamos el sistema desde el problema real, no desde el template.",
        stack: ["C#", ".NET", "Python", "TypeScript", "Docker", "Cloud"],
      },
      {
        id: "SRV-005", cat: "PRODUCTO",
        name: "PROTOTIPADO RÁPIDO",
        desc: "De idea a MVP funcional en el menor tiempo posible. Validamos la hipótesis antes de construir el sistema completo.",
        stack: ["Vite", "React", "Supabase", "Groq API", "Vercel"],
      },
      {
        id: "SRV-006", cat: "ANÁLISIS DE DATOS",
        name: "DATA PIPELINES & DASHBOARDS",
        desc: "Scraping, limpieza, transformación y visualización. Convertimos datos crudos en información accionable.",
        stack: ["Python", "FastAPI", "scikit-learn", "Claude API", "PostgreSQL"],
      },
    ],
  },
  en: {
    pre: "── AUTOMATIS / CAPABILITIES ──",
    headline: "SERVICES",
    sub: "We don't sell hours. We solve problems.\nEvery project is designed from the real problem, not from the catalog.",
    services: [
      {
        id: "SRV-001", cat: "OPERATIONS",
        name: "PROCESS AUTOMATION",
        desc: "End-to-end automation of real business workflows. We connect systems, eliminate friction, and build pipelines that run themselves.",
        stack: ["n8n", "Python", "REST APIs", "Webhooks", "Make"],
      },
      {
        id: "SRV-002", cat: "INFRASTRUCTURE",
        name: "FULL-STACK WEB DEVELOPMENT",
        desc: "Frontend + backend + deploy. Web systems built to scale from day one. Designed architecture, no accumulated technical debt.",
        stack: ["Next.js", "React", "Node.js", "Supabase", "PostgreSQL", "Vercel"],
      },
      {
        id: "SRV-003", cat: "PLATFORMS",
        name: "MOBILE APPS",
        desc: "Native and cross-platform apps designed to work in production. From wireframe to store deployment.",
        stack: ["React Native", "Expo", "iOS", "Android"],
      },
      {
        id: "SRV-004", cat: "ARCHITECTURE",
        name: "CUSTOM SYSTEMS",
        desc: "For businesses that have outgrown generic solutions. We design the system from the real problem, not the template.",
        stack: ["C#", ".NET", "Python", "TypeScript", "Docker", "Cloud"],
      },
      {
        id: "SRV-005", cat: "PRODUCT",
        name: "RAPID PROTOTYPING",
        desc: "From idea to functional MVP in the shortest possible time. Validate the hypothesis before building the full system.",
        stack: ["Vite", "React", "Supabase", "Groq API", "Vercel"],
      },
      {
        id: "SRV-006", cat: "DATA ANALYSIS",
        name: "DATA PIPELINES & DASHBOARDS",
        desc: "Scraping, cleaning, transformation, and visualization. We turn raw data into actionable intelligence.",
        stack: ["Python", "FastAPI", "scikit-learn", "Claude API", "PostgreSQL"],
      },
    ],
  },
};

type ServiceEntry = (typeof COPY.en.services)[number];

function ServiceCard({
  service,
  index,
  isInView,
  colSpan,
}: {
  service: ServiceEntry;
  index: number;
  isInView: boolean;
  colSpan: string;
}) {
  const [hov, setHov] = useState(false);
  const fromX = index % 2 === 0 ? -50 : 50;

  return (
    <motion.div
      initial={{ opacity: 0, x: fromX, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : { opacity: 0, x: fromX, filter: "blur(10px)" }}
      transition={{ duration: 0.9, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        gridColumn: colSpan,
        padding: "2.2rem clamp(1.5rem, 4vw, 3rem)",
        background: hov ? "rgba(10,4,4,1)" : "rgba(6,3,3,1)",
        borderLeft: "2px solid transparent",
        borderLeftColor: hov ? "rgba(139,26,26,0.65)" : "rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
        transition: "background 0.3s ease, border-left-color 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top: ID + category */}
      <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginBottom: "1.1rem" }}>
        <span style={{ fontFamily: "monospace", fontSize: "0.48rem", letterSpacing: "0.2em", color: "rgba(139,26,26,0.55)" }}>
          {service.id}
        </span>
        <span style={{ fontFamily: "monospace", fontSize: "0.42rem", letterSpacing: "0.2em", color: "rgba(212,201,184,0.18)", textTransform: "uppercase" }}>
          / {service.cat}
        </span>
      </div>

      {/* Name */}
      <div style={{
        fontFamily: "'Cinzel', serif",
        fontSize: "clamp(0.85rem, 1.8vw, 1.15rem)",
        fontWeight: 600,
        letterSpacing: "0.1em",
        color: hov ? "#e8ddd0" : "#d4c9b8",
        marginBottom: "0.85rem",
        lineHeight: 1.2,
        transition: "color 0.3s ease",
      }}>
        {service.name}
      </div>

      {/* Description */}
      <p style={{
        fontFamily: "monospace",
        fontSize: "0.6rem",
        color: "rgba(212,201,184,0.38)",
        lineHeight: 1.85,
        letterSpacing: "0.02em",
        marginBottom: "1.2rem",
        maxWidth: "480px",
      }}>
        {service.desc}
      </p>

      {/* Stack tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.28rem" }}>
        {service.stack.map((t) => (
          <span key={t} style={{
            fontFamily: "monospace",
            fontSize: "0.46rem",
            letterSpacing: "0.08em",
            color: hov ? "rgba(139,26,26,0.75)" : "rgba(139,26,26,0.5)",
            border: "1px solid",
            borderColor: hov ? "rgba(139,26,26,0.25)" : "rgba(139,26,26,0.15)",
            padding: "0.1rem 0.38rem",
            transition: "color 0.3s, border-color 0.3s",
          }}>
            {t}
          </span>
        ))}
      </div>

      {/* Corner accent on hover */}
      <motion.div
        animate={{ opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ position: "absolute", top: 14, right: 14, width: 16, height: 16, borderTop: "1px solid rgba(139,26,26,0.4)", borderRight: "1px solid rgba(139,26,26,0.4)" }}
      />
    </motion.div>
  );
}

export function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-8% 0px" });
  const lang = useLang();
  const c = COPY[lang];

  // Asymmetric column spans for 12-column grid
  // Row 1: 8/12 + 4/12  (SRV-001 wide, SRV-002 narrow)
  // Row 2: 4/12 + 8/12  (reversed — SRV-003 narrow, SRV-004 wide)
  // Row 3: 5/12 + 7/12  (SRV-005 slightly narrow, SRV-006 slightly wide)
  const spans = [
    "1 / 9", "9 / 13",
    "1 / 5", "5 / 13",
    "1 / 7", "7 / 13",
  ];

  return (
    <section
      ref={ref}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "10rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Off-center fog — left heavy */}
      <div
        className="animate-fog"
        style={{ position: "absolute", inset: "-20%", background: "radial-gradient(ellipse 55% 55% at 15% 55%, rgba(16,2,2,0.7) 0%, transparent 65%)", pointerEvents: "none" }}
      />
      <div
        className="animate-fog-slow"
        style={{ position: "absolute", inset: "-20%", background: "radial-gradient(ellipse 40% 40% at 85% 30%, rgba(10,2,2,0.5) 0%, transparent 65%)", pointerEvents: "none" }}
      />

      <div style={{ width: "100%", position: "relative", zIndex: 5 }}>
        {/* Header — left-aligned, intentionally not centered */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            paddingLeft: "clamp(1.5rem, 7vw, 7rem)",
            paddingRight: "2rem",
            marginBottom: "3.5rem",
          }}
        >
          <div style={{ fontFamily: "monospace", fontSize: "0.55rem", letterSpacing: "0.55em", color: "rgba(139,26,26,0.45)", marginBottom: "0.8rem", textTransform: "uppercase" }}>
            {c.pre}
          </div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)", fontWeight: 700, letterSpacing: "0.22em", color: "#d0c8bc", marginBottom: "0.7rem" }}>
            {c.headline}
          </h2>
          <p style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(212,201,184,0.25)", lineHeight: 1.8, maxWidth: "480px", whiteSpace: "pre-line" }}>
            {c.sub}
          </p>
        </motion.div>

        {/* Top border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          style={{ height: "1px", background: "linear-gradient(90deg, rgba(139,26,26,0.3), rgba(192,160,96,0.1), transparent)", transformOrigin: "left", marginBottom: "2px" }}
        />

        {/* Asymmetric 12-column services grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "2px" }}>
          {c.services.map((svc, i) => (
            <ServiceCard
              key={svc.id}
              service={svc}
              index={i}
              isInView={isInView}
              colSpan={spans[i]}
            />
          ))}
        </div>

        {/* Bottom border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(192,160,96,0.1), rgba(139,26,26,0.3))", transformOrigin: "right", marginTop: "2px" }}
        />
      </div>
    </section>
  );
}
