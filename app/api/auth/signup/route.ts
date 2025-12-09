import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Server not configured for Supabase" },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);
  const email = body?.email?.toLowerCase?.().trim?.();
  const password = body?.password;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  const password_hash = await bcrypt.hash(password, 10);

  const { data, error, status } = await supabaseAdmin
    .from("app_users")
    .insert({ email, password_hash })
    .select("id, email")
    .limit(1)
    .maybeSingle();

  if (error) {
    if (status === 409 || error.message.includes("duplicate")) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }
    console.error("Supabase insert error", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }

  return NextResponse.json({ user: data }, { status: 201 });
}


