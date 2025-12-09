import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.SUPABASE_JWT_SECRET;

export interface AuthContext {
  userId: string;
  token: string;
}

export function requireAuth(req: NextRequest): AuthContext | NextResponse {
  if (!jwtSecret) {
    return NextResponse.json(
      { error: "Server not configured (SUPABASE_JWT_SECRET missing)" },
      { status: 500 }
    );
  }

  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { sub?: string; user_id?: string };
    const userId = decoded.sub || decoded.user_id;
    if (!userId) throw new Error("Invalid token payload");
    return { userId, token };
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}


