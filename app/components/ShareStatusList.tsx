"use client";

import React from "react";
import { Card, CardContent } from "./Card";

export interface ShareStatus {
  guardianId: string;
  guardianEmail: string;
  status: "pending" | "approved";
}

interface ShareStatusListProps {
  shares: ShareStatus[];
  threshold: number;
}

export function ShareStatusList({ shares, threshold }: ShareStatusListProps) {
  const approvedCount = shares.filter((s) => s.status === "approved").length;

  const getStatusColor = (status: ShareStatus["status"]) => {
    return status === "approved" ? "text-emerald-600" : "text-amber-600";
  };

  const getStatusText = (status: ShareStatus["status"]) => {
    return status === "approved" ? "Approved" : "Pending";
  };

  return (
    <div className="space-y-3">
      <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
        <span>
          Approved: {approvedCount} / {threshold} (threshold)
        </span>
        <span
          className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
        >
          {approvedCount >= threshold ? "Ready" : "Waiting"}
        </span>
      </div>
      {shares.map((share) => (
        <Card
          key={share.guardianId}
          className="bg-white/85 backdrop-blur border-white/60"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{share.guardianEmail}</p>
                <p className={`text-sm ${getStatusColor(share.status)}`}>
                  {getStatusText(share.status)}
                </p>
              </div>
              <div
                className={`h-2 w-2 rounded-full ${
                  share.status === "approved" ? "bg-emerald-500" : "bg-amber-400"
                }`}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

