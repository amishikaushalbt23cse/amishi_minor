"use client";

import React, { useState, useEffect } from "react";
import { GuardianList, type Guardian } from "@/app/components/GuardianList";
import { Button } from "@/app/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/Card";
import { Modal } from "@/app/components/Modal";
import { InputField } from "@/app/components/InputField";
import { ToastContainer } from "@/app/components/Toast";
import type { ToastType } from "@/app/components/Toast";
import { motion, Variants } from "framer-motion";

export default function GuardiansPage() {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGuardianEmail, setNewGuardianEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([]);

  useEffect(() => {
    // Mock data for now
    setGuardians([
      { id: "1", email: "guardian1@example.com", status: "active" },
      { id: "2", email: "guardian2@example.com", status: "share_sent" },
    ]);
  }, []);

  const addToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddGuardian = async () => {
    if (!newGuardianEmail.trim()) {
      addToast("Please enter a guardian email", "error");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newGuardian: Guardian = {
        id: Math.random().toString(36).substring(7),
        email: newGuardianEmail,
        status: "invited",
      };

      setGuardians([...guardians, newGuardian]);
      setNewGuardianEmail("");
      setIsModalOpen(false);
      addToast("Guardian added successfully", "success");
    } catch {
      addToast("Failed to add guardian", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGuardian = async (id: string) => {
    try {
      setGuardians(guardians.filter((g) => g.id !== id));
      addToast("Guardian removed successfully", "success");
    } catch {
      addToast("Failed to remove guardian", "error");
    }
  };

  // Framer Motion variants
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, type: "spring", stiffness: 120 },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-40 via-pink-100 to-pink-300 relative overflow-hidden">
       {/* Animated blobs background */}
       <div className="absolute -z-10">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-pink-300 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute right-10 top-40 h-64 w-64 rounded-full bg-pink-400 blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute left-1/3 bottom-20 h-72 w-72 rounded-full bg-pink-500 blur-3xl animate-blob animation-delay-6000" />
      </div>
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 lg:py-14 space-y-6">
        <motion.div initial="hidden" animate="visible" custom={0} variants={fadeInUp} className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-pink-700 shadow-sm backdrop-blur">
              Guardian network
            </p>
            <h1 className="mt-3 text-4xl font-bold text-gray-900">Guardians</h1>
            <p className="text-gray-600">
              Invite, track, and manage the people who keep your shares safe.
            </p>
          </div>
          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeInUp}>
            <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-pink-200">
              Add Guardian
            </Button>
          </motion.div>
        </motion.div>

        <motion.div custom={2} initial="hidden" animate="visible" variants={fadeInUp}>
          <Card className="bg-white/85 backdrop-blur border-white/60">
            <CardHeader>
              <CardTitle>Guardian list</CardTitle>
            </CardHeader>
            <CardContent>
              <GuardianList guardians={guardians} onDelete={handleDeleteGuardian} />
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
            <Button onClick={handleAddGuardian} disabled={loading}>
              {loading ? "Adding..." : "Add Guardian"}
            </Button>
          </div>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}