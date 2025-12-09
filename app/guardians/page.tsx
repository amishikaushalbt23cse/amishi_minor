"use client";

import React, { useState, useEffect } from "react";
import { GuardianList, type Guardian } from "@/app/components/GuardianList";
import { Button } from "@/app/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/Card";
import { Modal } from "@/app/components/Modal";
import { InputField } from "@/app/components/InputField";
import { ToastContainer } from "@/app/components/Toast";
import type { ToastType } from "@/app/components/Toast";

export default function GuardiansPage() {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGuardianEmail, setNewGuardianEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type: ToastType }>
  >([]);

  useEffect(() => {
    // Load guardians from backend
    // TODO: Replace with actual API call
    // fetch('/api/guardians')
    //   .then(res => res.json())
    //   .then(data => setGuardians(data));

    // Mock data for now
    setGuardians([
      {
        id: "1",
        email: "guardian1@example.com",
        status: "active",
      },
      {
        id: "2",
        email: "guardian2@example.com",
        status: "share_sent",
      },
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
      // TODO: Replace with actual API call
      // const response = await fetch('/api/guardians', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: newGuardianEmail }),
      // });

      // Simulate API call
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
    } catch (error) {
      addToast("Failed to add guardian", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGuardian = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/guardians/${id}`, { method: 'DELETE' });

      setGuardians(guardians.filter((g) => g.id !== id));
      addToast("Guardian removed successfully", "success");
    } catch (error) {
      addToast("Failed to remove guardian", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 lg:py-14">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur">
              Guardian network
            </p>
            <h1 className="mt-3 text-4xl font-bold text-gray-900">Guardians</h1>
            <p className="text-gray-600">
              Invite, track, and manage the people who keep your shares safe.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-indigo-100">
            Add Guardian
          </Button>
        </div>

        <Card className="bg-white/85 backdrop-blur border-white/60">
          <CardHeader>
            <CardTitle>Guardian list</CardTitle>
          </CardHeader>
          <CardContent>
            <GuardianList guardians={guardians} onDelete={handleDeleteGuardian} />
          </CardContent>
        </Card>
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

