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
import type { ToastType } from "@/app/components/Toast";
import { generateShares } from "@/lib/sss";
import { encryptShare } from "@/lib/encryption";
import { motion, Variants } from "framer-motion";

export default function WalletSetupPage() {
  const router = useRouter();
  const [privateKey, setPrivateKey] = useState("");
  const [n, setN] = useState("5");
  const [t, setT] = useState("3");
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [newGuardianEmail, setNewGuardianEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
      addToast(`Number of guardians (${guardians.length}) must match n (${nNum})`, "error");
      return;
    }

    setLoading(true);

    try {
      const shares = generateShares(privateKey, nNum, tNum);

      const encryptionPassword = "default-password";
      const encryptedShares = shares.map((share, index) => ({
        share: encryptShare(JSON.stringify(share), encryptionPassword),
        guardianId: guardians[index].id,
        guardianEmail: guardians[index].email,
      }));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      addToast("Shares generated and distributed successfully!", "success");

      setGuardians(
        guardians.map((g) => ({ ...g, status: "share_sent" as const }))
      );

      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (error) {
      addToast("Failed to generate shares. Please try again.", "error");
      console.error("Error generating shares:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomKey = () => {
    const randomKey = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setPrivateKey(randomKey);
    addToast("Random private key generated", "success");
  };

  // Framer Motion variants
  const cardAnimation: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, type: "spring", stiffness: 120 },
    }),
  };

  const sections = [
    {
      title: "1. Private Key",
      content: (
        <>
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
        </>
      ),
    },
    {
      title: "2. Shamir split (n / t)",
      content: (
        <>
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
        </>
      ),
    },
    {
      title: "3. Guardians",
      content: (
        <>
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
          {guardians.length > 0 ? (
            <GuardianList guardians={guardians} onDelete={handleDeleteGuardian} />
          ) : (
            <p className="text-sm text-gray-500">
              No guardians added yet. Add {n} guardian(s) to proceed.
            </p>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-20 via-pink-100 to-pink-200 overflow-hidden">
       {/* Animated blobs background */}
       <div className="absolute -z-10">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-pink-300 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute right-10 top-40 h-64 w-64 rounded-full bg-pink-400 blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute left-1/3 bottom-20 h-72 w-72 rounded-full bg-pink-500 blur-3xl animate-blob animation-delay-6000" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 lg:py-14 space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="space-y-2"
        >
          <p className="inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-pink-700 shadow-sm backdrop-blur">
            Guided setup
          </p>
          <h1 className="text-4xl font-bold text-gray-900">Wallet setup</h1>
          <p className="text-gray-600">
            Enter your key, configure thresholds, and add guardians to distribute shares.
          </p>
        </motion.div>

        {sections.map((section, idx) => (
          <motion.div
            key={section.title}
            custom={idx}
            initial="hidden"
            animate="visible"
            variants={cardAnimation}
          >
            <Card className="bg-white/85 backdrop-blur border-white/60">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">{section.content}</CardContent>
            </Card>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/85 backdrop-blur border-white/60">
            <CardContent className="pt-6">
              <Button
                className="w-full shadow-lg shadow-pink-200"
                onClick={handleGenerateAndDistribute}
                disabled={loading || !privateKey || guardians.length === 0}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader size="sm" />
                    Generating Shares...
                  </div>
                ) : (
                  "Generate & Distribute Shares"
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Guardian">
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