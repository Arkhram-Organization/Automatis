import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const origin = new URL(req.url).origin;
  const { email, password } = await req.json();

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ error: "Email o contraseña incorrectos." }, { status: 401 });
  }

  return NextResponse.json({ ok: true, redirect: `${origin}/chat` });
}
