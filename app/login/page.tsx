"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { InputField } from "@/app/components/InputField";
import { Button } from "@/app/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/Card";
import { ToastContainer } from "@/app/components/Toast";
import type { ToastType } from "@/app/components/Toast";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type: ToastType }>
  >([]);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const addToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        addToast("Invalid email or password.", "error");
      } else if (result?.ok) {
        addToast("Login successful!", "success");
        router.push("/dashboard");
      } else {
        addToast("Login failed. Please try again.", "error");
      }
    } catch (error) {
      addToast("Login failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        console.error("Google login error:", result.error);
        let errorMessage = "Google login failed. Please try again.";
        
        // Provide more specific error messages
        if (result.error === "Configuration") {
          errorMessage = "Google OAuth is not configured. Please check your environment variables.";
        } else if (result.error === "AccessDenied") {
          errorMessage = "Access denied. Please grant permission to continue.";
        } else if (result.error === "OAuthSignin") {
          errorMessage = "Error initiating Google sign-in. Please try again.";
        } else if (result.error === "OAuthCallback") {
          errorMessage = "Error processing Google callback. Please try again.";
        } else if (result.error === "OAuthCreateAccount") {
          errorMessage = "Could not create account. Please try again.";
        } else if (result.error === "EmailCreateAccount") {
          errorMessage = "Could not create account with this email.";
        } else if (result.error === "Callback") {
          errorMessage = "Error in callback handler. Please try again.";
        } else if (result.error === "OAuthAccountNotLinked") {
          errorMessage = "Account is already linked to another user.";
        } else if (result.error === "EmailSignin") {
          errorMessage = "Email sign-in error. Please try again.";
        } else if (result.error === "CredentialsSignin") {
          errorMessage = "Invalid credentials. Please try again.";
        } else if (result.error === "SessionRequired") {
          errorMessage = "Session required. Please sign in again.";
        }
        
        addToast(errorMessage, "error");
        setLoading(false);
      } else if (result?.ok) {
        addToast("Login successful!", "success");
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        // If result is undefined or doesn't have ok/error, try redirecting
        addToast("Redirecting to Google...", "success");
        // Fallback: redirect directly
        window.location.href = "/api/auth/signin/google";
      }
    } catch (error) {
      console.error("Google login error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      addToast(`Google login failed: ${errorMessage}`, "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-2 md:px-6 lg:py-14">
        <div className="glass rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 text-sm font-medium text-indigo-700">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Secure access
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-gray-600">
            Sign in to manage guardians, shares, and recovery sessions.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              required
            />
            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs uppercase text-gray-500">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </Button>
          <div className="mt-4 text-sm text-center text-gray-600">
            No account?{" "}
            <button
              className="text-indigo-600 underline"
              onClick={() => router.push("/signup")}
            >
              Sign up
            </button>
          </div>
        </div>

        <div className="hidden md:block">
          <Card className="h-full w-full overflow-hidden border-none bg-gradient-to-br from-indigo-500 via-indigo-400 to-cyan-400 text-white shadow-2xl">
            <CardHeader className="p-8">
              <CardTitle className="text-3xl font-semibold">
                Your keys, beautifully protected.
              </CardTitle>
              <p className="mt-2 text-indigo-100">
                Track guardian approvals, monitor recovery progress, and stay
                confident with real-time status.
              </p>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <div className="rounded-xl bg-white/15 p-4 backdrop-blur">
                <div className="flex items-center justify-between text-sm text-indigo-50">
                  <span>Recovery session</span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
                    Live
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-indigo-50">
                  {["Alice", "Bob", "Charlie"].map((name) => (
                    <div
                      key={name}
                      className="rounded-lg bg-white/15 p-3 text-sm backdrop-blur"
                    >
                      <div className="text-xs uppercase opacity-75">Guardian</div>
                      <div className="font-medium">{name}</div>
                      <div className="text-[11px] text-emerald-100">Approved</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center justify-between text-sm text-indigo-50">
                  <span>Security score</span>
                  <span className="text-lg font-semibold text-white">A+</span>
                </div>
                <p className="mt-2 text-sm text-indigo-100">
                  Threshold: 3 of 5 | Real-time alerts | Zero knowledge storage
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

