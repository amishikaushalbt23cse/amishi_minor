"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { InputField } from "@/app/components/InputField";
import { Button } from "@/app/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/Card";
import { GuardianList, type Guardian } from "@/app/components/GuardianList";
import { Modal } from "@/app/components/Modal";
import { ToastContainer } from "@/app/components/Toast";
import { Loader } from "@/app/components/Loader";
import { WorkflowVisualizer } from "@/app/components/WorkflowVisualizer";
import type { ToastType } from "@/app/components/Toast";
import { generateShares } from "@/lib/sss";
import { encryptShare } from "@/lib/encryption";

export default function WalletSetupPage() {
  const router = useRouter();
  const [privateKey, setPrivateKey] = useState("");
  const [n, setN] = useState("5");
  const [t, setT] = useState("3");
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [newGuardianEmail, setNewGuardianEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // New state for the visualizer
  const [showVisualizer, setShowVisualizer] = useState(false);

  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type: ToastType }>
  >([]);

  const addToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleAddGuardian = () => {
    if (!newGuardianEmail.trim()) {
      addToast("Please enter a guardian email", "error");
      return;
    }

    const newGuardian: Guardian = {
      id: Math.random().toString(36).substring(7),
      email: newGuardianEmail,
      status: "invited",
    };

    setGuardians([...guardians, newGuardian]);
    setNewGuardianEmail("");
    setIsModalOpen(false);
    addToast("Guardian added successfully", "success");
  };

  const handleDeleteGuardian = (id: string) => {
    setGuardians(guardians.filter((g) => g.id !== id));
    addToast("Guardian removed", "success");
  };

  const handleGenerateAndDistribute = async () => {
    if (!privateKey.trim()) {
      addToast("Please enter a private key", "error");
      return;
    }

    const nNum = parseInt(n);
    const tNum = parseInt(t);

    if (isNaN(nNum) || isNaN(tNum) || nNum < 2 || tNum < 2) {
      addToast("Invalid n or t values", "error");
      return;
    }

    if (tNum > nNum) {
      addToast("Threshold (t) must be less than or equal to n", "error");
      return;
    }

    if (guardians.length !== nNum) {
      addToast(
        `Number of guardians (${guardians.length}) must match n (${nNum})`,
        "error"
      );
      return;
    }

    // Trigger the visualizer instead of just loading
    setLoading(true);
    setShowVisualizer(true);

    // We delay the actual logic slightly so the user sees the start of the animation
    setTimeout(async () => {
      try {
        // Generate shares using SSS (client-side)
        const shares = generateShares(privateKey, nNum, tNum);

        // Encrypt shares (in production, use proper encryption keys)
        const encryptionPassword = "default-password"; 
        const encryptedShares = shares.map((share, index) => ({
          share: encryptShare(JSON.stringify(share), encryptionPassword),
          guardianId: guardians[index].id,
          guardianEmail: guardians[index].email,
        }));

        // Send to backend (Simulated)
        // await fetch('/api/wallet/setup', ... );
        
        // Simulate API call to sync with animation "Processing" phase
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Update local state
        setGuardians(
          guardians.map((g) => ({ ...g, status: "share_sent" as const }))
        );
        
        // Note: We don't redirect immediately here. 
        // The Visualizer's onComplete prop triggers the redirect.

      } catch (error) {
        addToast("Failed to generate shares. Please try again.", "error");
        console.error("Error generating shares:", error);
        setLoading(false);
        setShowVisualizer(false); // Close visualizer on error
      }
    }, 500);
  };

  const onVisualizerComplete = () => {
    addToast("Shares generated and distributed successfully!", "success");
    router.push("/dashboard");
  };

  const generateRandomKey = () => {
    const randomKey = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setPrivateKey(randomKey);
    addToast("Random private key generated", "success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 lg:py-14">
        <div className="mb-8 space-y-2">
          <p className="inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur">
            Guided setup
          </p>
          <h1 className="text-4xl font-bold text-gray-900">Wallet setup</h1>
          <p className="text-gray-600">
            Enter your key, configure thresholds, and add guardians to distribute shares.
          </p>
        </div>

        {/* VISUALIZER OVERLAY */}
        {showVisualizer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-4xl p-6">
              <WorkflowVisualizer 
                mode="split" 
                n={parseInt(n)} 
                t={parseInt(t)} 
                isActive={showVisualizer} 
                onComplete={onVisualizerComplete}
              />
            </div>
          </div>
        )}

        <div className="space-y-6">
          <Card className="bg-white/85 backdrop-blur border-white/60">
            <CardHeader>
              <CardTitle>1. Private Key</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InputField
                label="Private Key"
                value={privateKey}
                onChange={setPrivateKey}
                placeholder="Enter or generate your private key"
                type="password"
              />
              <Button variant="outline" onClick={generateRandomKey}>
                Generate Random Key
              </Button>
              <p className="text-sm text-gray-500">
                Keep this secret. We only use it client-side to split into shares.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/85 backdrop-blur border-white/60">
            <CardHeader>
              <CardTitle>2. Shamir split (n / t)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  label="Number of shares (n)"
                  type="number"
                  value={n}
                  onChange={setN}
                  placeholder="e.g., 5"
                />
                <InputField
                  label="Threshold (t)"
                  type="number"
                  value={t}
                  onChange={setT}
                  placeholder="e.g., 3"
                />
              </div>
              <p className="text-sm text-gray-500">
                You need at least {t} of {n} shares to recover your wallet.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/85 backdrop-blur border-white/60">
            <CardHeader>
              <CardTitle>3. Guardians</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(true)}
                  disabled={guardians.length >= parseInt(n) || isNaN(parseInt(n))}
                >
                  Add Guardian
                </Button>
                <span className="text-sm text-gray-600">
                  {guardians.length}/{n} added
                </span>
              </div>
              {guardians.length > 0 && (
                <GuardianList
                  guardians={guardians}
                  onDelete={handleDeleteGuardian}
                />
              )}
              {guardians.length === 0 && (
                <p className="text-sm text-gray-500">
                  No guardians added yet. Add {n} guardian(s) to proceed.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/85 backdrop-blur border-white/60">
            <CardContent className="pt-6">
              <Button
                className="w-full shadow-lg shadow-indigo-100"
                onClick={handleGenerateAndDistribute}
                disabled={loading || !privateKey || guardians.length === 0}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader size="sm" />
                    Initializing Secure Workflow...
                  </div>
                ) : (
                  "Generate & Distribute Shares"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Guardian"
      >
        <div className="space-y-4">
          <InputField
            label="Guardian Email or Phone"
            value={newGuardianEmail}
            onChange={setNewGuardianEmail}
            placeholder="guardian@example.com"
            type="email"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGuardian}>Add Guardian</Button>
          </div>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
