import { supabaseAdmin } from "./supabase";

export async function logAction(params: {
  userId: string;
  walletId?: string;
  action: string;
  metadata?: Record<string, any>;
}) {
  if (!supabaseAdmin) {
    console.warn("[audit] supabase not configured; skipping log");
    return;
  }
  const { userId, walletId, action, metadata = {} } = params;
  const { error } = await supabaseAdmin
    .from("audit_logs")
    .insert([{ user_id: userId, wallet_id: walletId, action, metadata }]);
  if (error) {
    console.error("[audit] failed", error);
  }
}


