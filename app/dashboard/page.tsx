"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/Card";
import { Wallet, Shield, Users, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();

  const menuItems = [
    {
      title: "Setup Wallet",
      description: "Set up your wallet and configure guardians",
      icon: Wallet,
      path: "/wallet/setup",
      variant: "default" as const,
    },
    {
      title: "Recover Wallet",
      description: "Recover your wallet using guardian shares",
      icon: Shield,
      path: "/recovery",
      variant: "outline" as const,
    },
    {
      title: "Guardians",
      description: "Manage your guardians",
      icon: Users,
      path: "/guardians",
      variant: "outline" as const,
    },
    {
      title: "Vault",
      description: "View your recovered private key",
      icon: Lock,
      path: "/vault",
      variant: "outline" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 lg:py-14">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur">
              Control center
            </p>
            <h1 className="mt-3 text-4xl font-bold text-gray-900">
              Your recovery dashboard
            </h1>
            <p className="text-gray-600">
              Navigate wallet setup, guardians, recovery, and vault in one place.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
            <div className="rounded-xl bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
              <div className="text-xs text-gray-500">Guardians</div>
              <div className="text-lg font-semibold text-indigo-700">5</div>
            </div>
            <div className="rounded-xl bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
              <div className="text-xs text-gray-500">Recovery status</div>
              <div className="text-lg font-semibold text-emerald-700">Ready</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.path}
                className={cn(
                  "card-raise bg-white/85 backdrop-blur border-white/60",
                  idx === 0 && "shadow-lg shadow-indigo-100"
                )}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-50 p-3">
                      <Icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-gray-600">
                  <p>{item.description}</p>
                  <Button
                    variant={item.variant}
                    className="w-full"
                    onClick={() => router.push(item.path)}
                  >
                    Go to {item.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

