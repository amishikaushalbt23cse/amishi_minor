"use client";

import React from "react";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { Trash2 } from "lucide-react";

export interface Guardian {
  id: string;
  email: string;
  status: "invited" | "share_sent" | "active";
}

interface GuardianListProps {
  guardians: Guardian[];
  onDelete: (id: string) => void;
}

export function GuardianList({ guardians, onDelete }: GuardianListProps) {
  if (guardians.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No guardians added yet
      </div>
    );
  }

  const getStatusColor = (status: Guardian["status"]) => {
    switch (status) {
      case "active":
        return "text-green-600";
      case "share_sent":
        return "text-blue-600";
      case "invited":
        return "text-yellow-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusText = (status: Guardian["status"]) => {
    switch (status) {
      case "active":
        return "Active";
      case "share_sent":
        return "Share Sent";
      case "invited":
        return "Invited";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-3">
      {guardians.map((guardian) => (
        <Card key={guardian.id} className="bg-white/85 backdrop-blur border-white/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{guardian.email}</p>
                <p className={`text-sm ${getStatusColor(guardian.status)}`}>
                  {getStatusText(guardian.status)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(guardian.id)}
                className="text-destructive hover:text-destructive"
                aria-label={`Delete guardian ${guardian.email}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

