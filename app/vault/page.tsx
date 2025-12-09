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

export default function VaultPage() {
  const router = useRouter();
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type: ToastType }>
  >([]);

  useEffect(() => {
    // Load private key from session storage or backend
    if (typeof window !== "undefined") {
      const recoveredKey = sessionStorage.getItem("recoveredKey");
      if (recoveredKey) {
        setPrivateKey(recoveredKey);
      } else {
        // TODO: Fetch from backend if not in session
        // fetch('/api/vault/key')
        //   .then(res => res.json())
        //   .then(data => setPrivateKey(data.key));
      }
    }
    setLoading(false);
  }, []);

  const addToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCopyToClipboard = async () => {
    if (!privateKey) return;

    try {
      await navigator.clipboard.writeText(privateKey);
      addToast("Private key copied to clipboard", "success");
    } catch (error) {
      addToast("Failed to copy to clipboard", "error");
    }
  };

  const handleRegenerateShares = async () => {
    setRegenerating(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/vault/regenerate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      addToast("Shares regenerated and redistributed successfully", "success");
      setShowRegenerateModal(false);
      
      // Optionally redirect to setup
      setTimeout(() => {
        router.push("/wallet/setup");
      }, 2000);
    } catch (error) {
      addToast("Failed to regenerate shares", "error");
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!privateKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/85 backdrop-blur border-white/60">
            <CardContent className="p-8 text-center space-y-3">
              <Lock className="h-12 w-12 mx-auto text-gray-400" />
              <h2 className="text-2xl font-semibold">No Private Key Found</h2>
              <p className="text-gray-600">
                Recover your wallet first to view the private key.
              </p>
              <Button onClick={() => router.push("/recovery")}>
                Go to Recovery
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 space-y-2">
          <p className="inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur">
            Secure vault
          </p>
          <h1 className="text-4xl font-bold text-gray-900">Vault</h1>
          <p className="text-gray-600">
            Your recovered private key is shown below. Handle with care.
          </p>
        </div>

        <Card className="bg-white/90 backdrop-blur border-white/60 shadow-lg shadow-indigo-100">
          <CardHeader>
            <CardTitle>Private key</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border-2 border-dashed bg-gray-900/90 p-4 text-white">
              <p className="font-mono text-sm break-all select-all">{privateKey}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                onClick={handleCopyToClipboard}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowRegenerateModal(true)}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate Shares
              </Button>
            </div>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> Anyone with this key can control your wallet. Do not share it.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

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
            <Button
              variant="outline"
              onClick={() => setShowRegenerateModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRegenerateShares}
              disabled={regenerating}
            >
              {regenerating ? (
                <div className="flex items-center gap-2">
                  <Loader size="sm" />
                  Regenerating...
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

