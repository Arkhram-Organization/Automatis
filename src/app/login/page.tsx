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

  function handleGoogle() {
    setLoading(true);
    setError("");
    window.location.href = "/api/auth/google";
  }

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

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-200 text-sm font-medium transition-all duration-200 disabled:opacity-50 group"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continuar con Google</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-800/80" />
            <span className="text-[11px] text-zinc-600 uppercase tracking-wider">o</span>
            <div className="flex-1 h-px bg-zinc-800/80" />
          </div>

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
