"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/Card";
import { ShareStatusList, type ShareStatus } from "@/app/components/ShareStatusList";
import { ToastContainer } from "@/app/components/Toast";
import { Loader } from "@/app/components/Loader";
import type { ToastType } from "@/app/components/Toast";
import { decryptShare } from "@/lib/encryption";
import { reconstructSecret } from "@/lib/sss";
import type { Share } from "@/lib/sss";

export default function RecoveryPage() {
  const router = useRouter();
  const [recoveryStarted, setRecoveryStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reconstructing, setReconstructing] = useState(false);
  const [shareStatuses, setShareStatuses] = useState<ShareStatus[]>([]);
  const [threshold, setThreshold] = useState(3);
  const [reconstructedKey, setReconstructedKey] = useState<string | null>(null);
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type: ToastType }>
  >([]);

  const addToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleStartRecovery = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/recovery/start', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      // });

      // Simulate API call - backend sends Twilio call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock share statuses
      setShareStatuses([
        {
          guardianId: "1",
          guardianEmail: "guardian1@example.com",
          status: "pending",
        },
        {
          guardianId: "2",
          guardianEmail: "guardian2@example.com",
          status: "pending",
        },
        {
          guardianId: "3",
          guardianEmail: "guardian3@example.com",
          status: "pending",
        },
        {
          guardianId: "4",
          guardianEmail: "guardian4@example.com",
          status: "pending",
        },
        {
          guardianId: "5",
          guardianEmail: "guardian5@example.com",
          status: "pending",
        },
      ]);

      setRecoveryStarted(true);
      addToast("Recovery session started. Twilio calls sent to guardians.", "success");

      // Simulate guardians approving over time
      setTimeout(() => {
        setShareStatuses((prev) =>
          prev.map((s, i) => (i < 2 ? { ...s, status: "approved" as const } : s))
        );
      }, 2000);

      setTimeout(() => {
        setShareStatuses((prev) =>
          prev.map((s, i) => (i < 3 ? { ...s, status: "approved" as const } : s))
        );
      }, 4000);
    } catch (error) {
      addToast("Failed to start recovery session", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReconstructKey = async () => {
    const approvedCount = shareStatuses.filter((s) => s.status === "approved").length;
    
    if (approvedCount < threshold) {
      addToast(
        `Need at least ${threshold} approved shares. Currently have ${approvedCount}.`,
        "error"
      );
      return;
    }

    setReconstructing(true);
    try {
      // Get approved shares from backend
      // TODO: Replace with actual API call
      // const response = await fetch('/api/recovery/shares', {
      //   method: 'GET',
      // });

      // Mock encrypted shares
      const encryptionPassword = "default-password"; // TODO: Use proper key management
      const mockEncryptedShares = [
        { share: "encrypted_share_1", guardianId: "1" },
        { share: "encrypted_share_2", guardianId: "2" },
        { share: "encrypted_share_3", guardianId: "3" },
      ];

      // Decrypt shares
      const decryptedShares: Share[] = mockEncryptedShares.map((encShare, index) => {
        const decrypted = decryptShare(encShare.share, encryptionPassword);
        const shareData = JSON.parse(decrypted);
        return { x: shareData.x, y: shareData.y };
      });

      // Reconstruct private key
      const privateKey = reconstructSecret(decryptedShares, threshold);
      setReconstructedKey(privateKey);

      addToast("Private key reconstructed successfully!", "success");

      // Store in session/localStorage temporarily
      if (typeof window !== "undefined") {
        sessionStorage.setItem("recoveredKey", privateKey);
      }

      setTimeout(() => {
        router.push("/vault");
      }, 1500);
    } catch (error) {
      addToast("Failed to reconstruct key. Please try again.", "error");
      console.error("Error reconstructing key:", error);
    } finally {
      setReconstructing(false);
    }
  };

  const approvedCount = shareStatuses.filter((s) => s.status === "approved").length;
  const canReconstruct = approvedCount >= threshold;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 lg:py-14">
        <div className="mb-8 space-y-2">
          <p className="inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur">
            Guided recovery
          </p>
          <h1 className="text-4xl font-bold text-gray-900">Wallet recovery</h1>
          <p className="text-gray-600">
            Start a recovery session, track guardian approvals, and reconstruct your key.
          </p>
        </div>

        <div className="space-y-6">
          {!recoveryStarted && (
            <Card className="bg-white/85 backdrop-blur border-white/60">
              <CardHeader>
                <CardTitle>Start recovery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  We’ll notify guardians (e.g., via Twilio) to approve your request. Once enough
                  approvals are collected, you can reconstruct the key.
                </p>
                <Button
                  onClick={handleStartRecovery}
                  disabled={loading}
                  className="w-full shadow-lg shadow-indigo-100"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader size="sm" />
                      Starting Recovery...
                    </div>
                  ) : (
                    "Start Recovery"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {recoveryStarted && (
            <Card className="bg-white/85 backdrop-blur border-white/60">
              <CardHeader>
                <CardTitle>Guardian approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <ShareStatusList shares={shareStatuses} threshold={threshold} />
              </CardContent>
            </Card>
          )}

          {recoveryStarted && (
            <Card className="bg-white/85 backdrop-blur border-white/60">
              <CardContent className="pt-6">
                <Button
                  className="w-full"
                  onClick={handleReconstructKey}
                  disabled={!canReconstruct || reconstructing}
                >
                  {reconstructing ? (
                    <div className="flex items-center gap-2">
                      <Loader size="sm" />
                      Reconstructing Key...
                    </div>
                  ) : (
                    "Reconstruct Key"
                  )}
                </Button>
                {!canReconstruct && (
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Need {threshold - approvedCount} more approval(s) to reconstruct.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {reconstructedKey && (
            <Card className="bg-white/90 backdrop-blur border-white/70">
              <CardHeader>
                <CardTitle>Recovered private key</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-900 text-white rounded-md font-mono text-sm break-all">
                  {reconstructedKey}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Redirecting to vault...
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

