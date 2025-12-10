"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { InputField } from "@/app/components/InputField";
import { Button } from "@/app/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/Card";
import { ToastContainer } from "@/app/components/Toast";
import type { ToastType } from "@/app/components/Toast";

export default function SignupPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type: ToastType }>
  >([]);

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data?.error || "Signup failed";
        addToast(msg, "error");
        setLoading(false);
        return;
      }

      // Auto sign-in after signup
      const signInResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/dashboard",
      });

      if (signInResult?.error) {
        addToast("Account created, please log in.", "success");
        router.push("/login");
      } else {
        addToast("Signup successful!", "success");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Signup error", err);
      addToast("Signup failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-indigo-50">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-2 md:px-6 lg:py-14">
        <div className="glass rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 text-sm font-medium text-cyan-700">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Create your secure account
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Start protecting your keys
          </h1>
          <p className="mt-2 text-gray-600">
            Build your guardian network and set up recovery in minutes.
          </p>
          <form onSubmit={handleSignup} className="mt-6 space-y-4">
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
              placeholder="At least 6 characters"
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign up"}
            </Button>
          </form>
          <div className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <button
              className="text-indigo-600 underline"
              onClick={() => router.push("/login")}
            >
              Log in
            </button>
          </div>
        </div>

        <div className="hidden md:block">
          <Card className="h-full w-full overflow-hidden border-none bg-gradient-to-br from-cyan-500 via-indigo-400 to-purple-500 text-white shadow-2xl">
            <CardHeader className="p-8">
              <CardTitle className="text-3xl font-semibold">
                Recovery you can trust.
              </CardTitle>
              <p className="mt-2 text-indigo-100">
                Set thresholds, invite guardians, and monitor everything from one
                beautiful dashboard.
              </p>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <div className="rounded-xl bg-white/15 p-4 backdrop-blur">
                <div className="flex items-center justify-between text-sm text-indigo-50">
                  <span>Setup checklist</span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
                    3 steps
                  </span>
                </div>
                <ul className="mt-3 space-y-2 text-indigo-50">
                  <li>• Create account and verify email</li>
                  <li>• Add guardians and set threshold</li>
                  <li>• Generate shares and store securely</li>
                </ul>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center justify-between text-sm text-indigo-50">
                  <span>Why this matters</span>
                  <span className="text-lg font-semibold text-white">Peace</span>
                </div>
                <p className="mt-2 text-sm text-indigo-100">
                  Your assets stay yours. We keep it simple, elegant, and secure.
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