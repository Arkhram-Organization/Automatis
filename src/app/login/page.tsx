"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useScramble } from "@/hooks/useScramble";
import Link from "next/link";

function LoginForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
    if (searchParams.get("error")) setError("Error de autenticación. Intentá de nuevo.");
  }, [searchParams]);

  const title = useScramble(
    mode === "login" ? "Bienvenido de vuelta." : "Crear tu cuenta.",
    { delay: 0, speed: 50, trigger: mounted }
  );

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error inesperado. Intentá de nuevo.");
      } else if (mode === "login") {
        router.push("/chat");
      } else {
        setSuccess(data.message ?? "Revisá tu email para confirmar tu cuenta.");
      }
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#050505] flex overflow-hidden">
      {/* Left panel — visual */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden p-12">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-700/25 rounded-full blur-[130px]" />
          <div className="absolute bottom-1/4 right-0 w-[350px] h-[350px] bg-indigo-700/20 rounded-full blur-[100px]" />
        </div>

        {/* Top wordmark */}
        <div>
          <Link href="/" className="text-sm font-bold text-white font-mono tracking-tight">
            Automatis
          </Link>
        </div>

        {/* Center quote / feature */}
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-3xl font-bold text-white leading-snug max-w-xs">
              Automatizá tu negocio{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                con una sola conversación.
              </span>
            </p>
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
              Describís qué querés, la IA pregunta lo que falta y genera el flujo lista para usar.
            </p>
          </div>

          {/* Testimonial / social proof */}
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm p-5 max-w-xs">
            <p className="text-zinc-300 text-sm leading-relaxed">
              "En 10 minutos tenía mi primera automatización corriendo. Nunca había usado n8n."
            </p>
            <div className="mt-3 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-violet-600/40 flex items-center justify-center text-xs font-bold text-violet-300">
                MG
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-300">Martín G.</p>
                <p className="text-[11px] text-zinc-600">Inmobiliaria · Buenos Aires</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="flex gap-8">
          {[["500+", "Automatizaciones creadas"], ["12", "Industrias"], ["< 5min", "Para el primer flujo"]].map(([n, l]) => (
            <div key={n}>
              <p className="text-lg font-bold text-white">{n}</p>
              <p className="text-[11px] text-zinc-600">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-7">
          {/* Mobile wordmark */}
          <div className="lg:hidden">
            <Link href="/" className="text-sm font-bold text-white font-mono">Automatis</Link>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white font-mono">
              {mounted ? title : (mode === "login" ? "Bienvenido de vuelta." : "Crear tu cuenta.")}
            </h1>
            <p className="text-sm text-zinc-500">
              {mode === "login" ? "Ingresá a tu cuenta para continuar." : "Empezá gratis, sin tarjeta de crédito."}
            </p>
          </div>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}
          {success && (
            <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
              {success}
            </div>
          )}

          {/* Email form */}
          <form onSubmit={handleEmail} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 focus:border-violet-500/50 focus:outline-none text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 focus:border-violet-500/50 focus:outline-none text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all duration-200 disabled:opacity-50 hover:shadow-[0_0_25px_rgba(124,58,237,0.35)] flex items-center justify-center gap-2 group"
            >
              <span>{loading ? "Cargando..." : mode === "login" ? "Ingresar" : "Crear cuenta"}</span>
              {!loading && <ArrowRight className="w-3.5 h-3.5 -translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-200" />}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-600">
            {mode === "login" ? "¿No tenés cuenta? " : "¿Ya tenés cuenta? "}
            <button
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setSuccess(""); }}
              className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
            >
              {mode === "login" ? "Crear cuenta gratis" : "Iniciar sesión"}
            </button>
          </p>

          <p className="text-center text-[11px] text-zinc-700">
            Al continuar aceptás los{" "}
            <span className="text-zinc-600 cursor-pointer hover:text-zinc-400 transition-colors">Términos de uso</span>
            {" "}y{" "}
            <span className="text-zinc-600 cursor-pointer hover:text-zinc-400 transition-colors">Política de privacidad</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
