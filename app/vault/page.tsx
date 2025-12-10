"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/Card";
import { Modal } from "@/app/components/Modal";
import { ToastContainer } from "@/app/components/Toast";
import { Loader } from "@/app/components/Loader";
import { Copy, RefreshCw, Lock } from "lucide-react";
import type { ToastType } from "@/app/components/Toast";
import { motion, Variants } from "framer-motion";

export default function VaultPage() {
  const router = useRouter();
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const recoveredKey = sessionStorage.getItem("recoveredKey");
      if (recoveredKey) setPrivateKey(recoveredKey);
    }
    setLoading(false);
  }, []);

  const addToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const handleCopyToClipboard = async () => {
    if (!privateKey) return;
    try {
      await navigator.clipboard.writeText(privateKey);
      addToast("Private key copied to clipboard", "success");
    } catch {
      addToast("Failed to copy to clipboard", "error");
    }
  };

  const handleRegenerateShares = async () => {
    setRegenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      addToast("Shares regenerated and redistributed successfully", "success");
      setShowRegenerateModal(false);
      setTimeout(() => router.push("/wallet/setup"), 2000);
    } catch {
      addToast("Failed to regenerate shares", "error");
    } finally {
      setRegenerating(false);
    }
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, type: "spring", stiffness: 120 },
    }),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-pink-100 to-pink-300">
        <Loader size="lg" />
      </div>
    );
  }

  if (!privateKey) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-pink-300 p-8 overflow-hidden">
        {/* Floating blobs */}
        <motion.div
          className="absolute -z-10"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        >
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-purple-300 blur-3xl opacity-70 animate-pulse" />
          <div className="absolute right-10 top-40 h-64 w-64 rounded-full bg-pink-400 blur-3xl opacity-60 animate-pulse" />
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeInUp} custom={0}>
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/85 backdrop-blur border-white/60">
              <CardContent className="p-8 text-center space-y-3">
                <Lock className="h-12 w-12 mx-auto text-gray-400" />
                <h2 className="text-2xl font-semibold">No Private Key Found</h2>
                <p className="text-gray-600">Recover your wallet first to view the private key.</p>
                <Button onClick={() => router.push("/recovery")}>Go to Recovery</Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

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

      <motion.div initial="hidden" animate="visible" variants={fadeInUp} custom={0} className="max-w-4xl mx-auto space-y-6">
        <div className="mb-8 space-y-2">
          <p className="inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-pink-700 shadow-sm backdrop-blur">
            Secure vault
          </p>
          <h1 className="text-4xl font-bold text-gray-900">Vault</h1>
          <p className="text-gray-600">
            Your recovered private key is shown below. Handle with care.
          </p>
        </div>

        <motion.div custom={1} initial="hidden" animate="visible" variants={fadeInUp}>
          <Card className="bg-white/90 backdrop-blur border-white/60 shadow-lg shadow-pink-200">
            <CardHeader>
              <CardTitle>Private key</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border-2 border-dashed bg-gray-900/90 p-4 text-white">
                <p className="font-mono text-sm break-all select-all">{privateKey}</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="outline" onClick={handleCopyToClipboard} className="flex-1">
                  <Copy className="h-4 w-4 mr-2" /> Copy to Clipboard
                </Button>
                <Button variant="outline" onClick={() => setShowRegenerateModal(true)} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" /> Regenerate Shares
                </Button>
              </div>

              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> Anyone with this key can control your wallet. Do not share it.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <Modal
        isOpen={showRegenerateModal}
        onClose={() => setShowRegenerateModal(false)}
        title="Regenerate Shares"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Generate new shares and redistribute them to your guardians. Current shares become invalid.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowRegenerateModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRegenerateShares} disabled={regenerating}>
              {regenerating ? (
                <div className="flex items-center gap-2">
                  <Loader size="sm" /> Regenerating...
                </div>
              ) : (
                "Regenerate Shares"
              )}
            </Button>
          </div>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}