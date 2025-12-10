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
import { motion, Variants } from "framer-motion";

export default function RecoveryPage() {
  const router = useRouter();
  const [recoveryStarted, setRecoveryStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reconstructing, setReconstructing] = useState(false);
  const [shareStatuses, setShareStatuses] = useState<ShareStatus[]>([]);
  const [threshold, setThreshold] = useState(3);
  const [reconstructedKey, setReconstructedKey] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([]);

  const addToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const handleStartRecovery = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setShareStatuses([
        { guardianId: "1", guardianEmail: "guardian1@example.com", status: "pending" },
        { guardianId: "2", guardianEmail: "guardian2@example.com", status: "pending" },
        { guardianId: "3", guardianEmail: "guardian3@example.com", status: "pending" },
        { guardianId: "4", guardianEmail: "guardian4@example.com", status: "pending" },
        { guardianId: "5", guardianEmail: "guardian5@example.com", status: "pending" },
      ]);

      setRecoveryStarted(true);
      addToast("Recovery session started. Twilio calls sent to guardians.", "success");

      // Simulate approvals
      setTimeout(() => {
        setShareStatuses((prev) => prev.map((s, i) => (i < 2 ? { ...s, status: "approved" } : s)));
      }, 2000);
      setTimeout(() => {
        setShareStatuses((prev) => prev.map((s, i) => (i < 3 ? { ...s, status: "approved" } : s)));
      }, 4000);
    } catch {
      addToast("Failed to start recovery session", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReconstructKey = async () => {
    const approvedCount = shareStatuses.filter((s) => s.status === "approved").length;
    if (approvedCount < threshold) {
      addToast(`Need at least ${threshold} approved shares. Currently have ${approvedCount}.`, "error");
      return;
    }

    setReconstructing(true);
    try {
      const encryptionPassword = "default-password";
      const mockEncryptedShares = [
        { share: "encrypted_share_1", guardianId: "1" },
        { share: "encrypted_share_2", guardianId: "2" },
        { share: "encrypted_share_3", guardianId: "3" },
      ];

      const decryptedShares = mockEncryptedShares.map((encShare) => {
        const decrypted = decryptShare(encShare.share, encryptionPassword);
        const shareData = JSON.parse(decrypted);
        return { x: shareData.x, y: shareData.y };
      });

      const privateKey = reconstructSecret(decryptedShares, threshold);
      setReconstructedKey(privateKey);

      addToast("Private key reconstructed successfully!", "success");

      if (typeof window !== "undefined") sessionStorage.setItem("recoveredKey", privateKey);

      setTimeout(() => router.push("/vault"), 1500);
    } catch (error) {
      addToast("Failed to reconstruct key. Please try again.", "error");
      console.error(error);
    } finally {
      setReconstructing(false);
    }
  };

  const approvedCount = shareStatuses.filter((s) => s.status === "approved").length;
  const canReconstruct = approvedCount >= threshold;

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, type: "spring", stiffness: 120 },
    }),
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-20 via-pink-100 to-pink-200 overflow-hidden">

      {/* Animated blobs background */}
      <div className="absolute -z-10">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-pink-300 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute right-10 top-40 h-64 w-64 rounded-full bg-pink-400 blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute left-1/3 bottom-20 h-72 w-72 rounded-full bg-pink-500 blur-3xl animate-blob animation-delay-6000" />
      </div>
      {/* Floating animated blobs */}
      <motion.div
        className="absolute -z-10"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
      >
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-purple-300 blur-3xl opacity-70 animate-pulse" />
        <div className="absolute right-10 top-40 h-64 w-64 rounded-full bg-pink-400 blur-3xl opacity-60 animate-pulse" />
        <div className="absolute left-1/3 bottom-20 h-72 w-72 rounded-full bg-pink-300 blur-3xl opacity-70 animate-pulse" />
      </motion.div>

      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 lg:py-14 space-y-6">
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeInUp} className="space-y-2">
          <p className="inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-pink-700 shadow-sm backdrop-blur">
            Guided recovery
          </p>
          <h1 className="text-4xl font-bold text-gray-900">Wallet recovery</h1>
          <p className="text-gray-600">
            Start a recovery session, track guardian approvals, and reconstruct your key.
          </p>
        </motion.div>

        {!recoveryStarted && (
          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeInUp}>
            <Card className="bg-white/85 backdrop-blur border-white/60">
              <CardHeader>
                <CardTitle>Start recovery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Guardians will be notified to approve your request. Collect enough approvals to reconstruct the key.
                </p>
                <Button onClick={handleStartRecovery} disabled={loading} className="w-full shadow-lg shadow-pink-200">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader size="sm" /> Starting Recovery...
                    </div>
                  ) : (
                    "Start Recovery"
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {recoveryStarted && (
          <motion.div custom={2} initial="hidden" animate="visible" variants={fadeInUp}>
            <Card className="bg-white/85 backdrop-blur border-white/60">
              <CardHeader>
                <CardTitle>Guardian approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <ShareStatusList shares={shareStatuses} threshold={threshold} />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {recoveryStarted && (
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeInUp}>
            <Card className="bg-white/85 backdrop-blur border-white/60">
              <CardContent className="pt-6">
                <Button className="w-full" onClick={handleReconstructKey} disabled={!canReconstruct || reconstructing}>
                  {reconstructing ? (
                    <div className="flex items-center gap-2">
                      <Loader size="sm" /> Reconstructing Key...
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
          </motion.div>
        )}

        {reconstructedKey && (
          <motion.div custom={4} initial="hidden" animate="visible" variants={fadeInUp}>
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
          </motion.div>
        )}
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}