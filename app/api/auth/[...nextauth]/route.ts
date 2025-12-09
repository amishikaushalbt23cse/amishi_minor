import NextAuth, { type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";

// Validate environment variables
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
const nextAuthUrl = process.env.NEXTAUTH_URL;

if (!googleClientId || !googleClientSecret) {
  console.error("Missing Google OAuth credentials. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local");
}

if (!nextAuthSecret) {
  console.error("Missing NEXTAUTH_SECRET. Please set it in .env.local");
}

if (!nextAuthUrl) {
  console.warn("NEXTAUTH_URL is not set. Defaulting to http://localhost:3000");
}

export const authOptions: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: googleClientId || "",
      clientSecret: googleClientSecret || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!supabaseAdmin) {
          throw new Error("Supabase client not configured");
        }
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;
        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        const { data, error } = await supabaseAdmin
          .from("app_users")
          .select("id, email, password_hash")
          .eq("email", email)
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Supabase fetch error", error);
          throw new Error("Unable to sign in right now");
        }

        if (!data) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, data.password_hash);
        if (!passwordMatch) {
          return null;
        }

        return {
          id: data.id,
          email: data.email,
          name: data.email,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user || !account) {
        console.error("Sign in failed: missing user or account");
        return false;
      }
      return true;
    },
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.id = user.id || user.email || "";
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: nextAuthSecret,
  debug: process.env.NODE_ENV === "development",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

export const GET = handlers.GET;
export const POST = handlers.POST;

