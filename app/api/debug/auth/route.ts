import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const envVars = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "Set" : "Missing",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Missing",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Set" : "Missing",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "Not set (using default)",
    NODE_ENV: process.env.NODE_ENV || "Not set",
  };

  const issues = [];

  if (!process.env.GOOGLE_CLIENT_ID) {
    issues.push("GOOGLE_CLIENT_ID is missing");
  }

  if (!process.env.GOOGLE_CLIENT_SECRET) {
    issues.push("GOOGLE_CLIENT_SECRET is missing");
  }

  if (!process.env.NEXTAUTH_SECRET) {
    issues.push("NEXTAUTH_SECRET is missing");
  }

  // Check if Google Client ID looks valid
  if (process.env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com')) {
    issues.push("GOOGLE_CLIENT_ID doesn't look like a valid Google OAuth client ID");
  }

  return NextResponse.json({
    environment: envVars,
    issues: issues.length > 0 ? issues : ["No obvious configuration issues found"],
    recommendations: [
      "Ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are from Google Cloud Console",
      "Verify Authorized redirect URIs include: http://localhost:3000/api/auth/callback/google",
      "Check that OAuth consent screen is configured",
      "Restart dev server after changing .env.local",
    ]
  });
}
