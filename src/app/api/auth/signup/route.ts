import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const signupSchema = z.object({
  email: z.string().email("Email inválido").toLowerCase(),
  password: z.string().min(8, "Contraseña debe tener al menos 8 caracteres"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = signupSchema.parse(body);

    const origin = new URL(req.url).origin;
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });

    if (error) {
      return NextResponse.json({ error: "No se pudo crear la cuenta. Intentá de nuevo." }, { status: 400 });
    }

    return NextResponse.json({ ok: true, message: "Revisá tu email para confirmar tu cuenta." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }
}
