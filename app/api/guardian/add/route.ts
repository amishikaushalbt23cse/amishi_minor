import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/api/_lib/supabase";
import { requireAuth } from "@/app/api/_lib/auth";
import { logAction } from "@/app/api/_lib/logger";

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { userId } = auth;

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const walletId = body?.walletId as string;
  const email = body?.email as string;
  const phone = body?.phone as string | undefined;

  if (!walletId || !email) {
    return NextResponse.json({ error: "walletId and email required" }, { status: 400 });
  }

  // Ownership check via select with RLS
  const { error: checkErr } = await supabaseAdmin
    .from("wallets")
    .select("id")
    .eq("id", walletId)
    .eq("user_id", userId)
    .single();

  if (checkErr) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data, error } = await supabaseAdmin
    .from("guardians")
    .insert([{ wallet_id: walletId, email, phone: phone || null, status: "invited" }])
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Failed to add guardian" }, { status: 500 });
  }

  await logAction({
    userId,
    walletId,
    action: "guardian_added",
    metadata: { guardianId: data.id, email },
  });

  return NextResponse.json({ guardianId: data.id }, { status: 201 });
}


