import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/api/_lib/supabase";
import { requireAuth } from "@/app/api/_lib/auth";
import { sendGuardianShareEmail } from "@/app/api/_lib/mailer";
import { logAction } from "@/app/api/_lib/logger";

interface GuardianInput {
  email: string;
  phone?: string;
}

interface ShareInput {
  guardianId?: string;
  email: string;
  phone?: string;
  encrypted_share: string;
  hmac?: string;
}

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
  const n = body?.n;
  const t = body?.t;
  const guardians: GuardianInput[] = body?.guardians || [];
  const encryptedShares: ShareInput[] = body?.encryptedShares || [];

  if (!n || !t || !Array.isArray(guardians) || !Array.isArray(encryptedShares)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (guardians.length !== encryptedShares.length || guardians.length !== n) {
    return NextResponse.json(
      { error: "Guardians / shares count must match n" },
      { status: 400 }
    );
  }

  // Create wallet
  const { data: wallet, error: walletErr } = await supabaseAdmin
    .from("wallets")
    .insert([{ user_id: userId, n_shares: n, threshold: t }])
    .select("id")
    .single();

  if (walletErr || !wallet) {
    return NextResponse.json(
      { error: "Failed to create wallet" },
      { status: 500 }
    );
  }

  const walletId = wallet.id;

  // Insert guardians
  const guardiansInsert = guardians.map((g) => ({
    wallet_id: walletId,
    email: g.email,
    phone: g.phone || null,
    status: "invited",
  }));

  const { data: guardianRows, error: guardianErr } = await supabaseAdmin
    .from("guardians")
    .insert(guardiansInsert)
    .select("id,email,phone");

  if (guardianErr || !guardianRows) {
    return NextResponse.json(
      { error: "Failed to add guardians" },
      { status: 500 }
    );
  }

  // Map email -> guardian id
  const guardianByEmail = new Map(
    guardianRows.map((g) => [g.email.toLowerCase(), g.id])
  );

  const sharesInsert = encryptedShares.map((s) => {
    const guardianId = s.guardianId || guardianByEmail.get(s.email.toLowerCase());
    return {
      wallet_id: walletId,
      guardian_id: guardianId,
      encrypted_share: s.encrypted_share,
      hmac: s.hmac || "",
      status: "sent",
    };
  });

  const { error: sharesErr } = await supabaseAdmin
    .from("shares")
    .insert(sharesInsert);

  if (sharesErr) {
    return NextResponse.json(
      { error: "Failed to store shares" },
      { status: 500 }
    );
  }

  // Fire-and-forget guardian emails
  sharesInsert.forEach((share, idx) => {
    const guardian = guardians[idx];
    if (guardian?.email) {
      sendGuardianShareEmail({
        to: guardian.email,
        walletId,
        encryptedShare: share.encrypted_share,
        hmac: share.hmac,
      }).catch((e) => console.error("Email send failed", e));
    }
  });

  await logAction({
    userId,
    walletId,
    action: "wallet_created",
    metadata: { n, t, guardians: guardians.length },
  });

  return NextResponse.json({ walletId }, { status: 201 });
}


