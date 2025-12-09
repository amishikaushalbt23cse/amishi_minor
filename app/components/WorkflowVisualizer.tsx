"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Shield, Key, User, Check, FileKey } from "lucide-react";

interface WorkflowVisualizerProps {
  mode: "split" | "combine";
  n: number;
  t: number;
  isActive: boolean;
  onComplete?: () => void;
  className?: string;
}

export function WorkflowVisualizer({ 
  mode, 
  n, 
  t, 
  isActive, 
  onComplete, 
  className 
}: WorkflowVisualizerProps) {
  const [step, setStep] = useState<"idle" | "processing" | "distributing" | "complete">("idle");

  useEffect(() => {
    if (isActive && step === "idle") {
      runAnimation();
    }
  }, [isActive]);

  const runAnimation = async () => {
    setStep("processing");
    // Simulate math/polynomial generation time
    await new Promise((r) => setTimeout(r, 1500));
    
    setStep("distributing");
    // Simulate network travel time for shares
    await new Promise((r) => setTimeout(r, 2000));
    
    setStep("complete");
    if (onComplete) {
      setTimeout(onComplete, 1000); // Wait a moment before closing
    }
  };

  return (
    <div className={cn("relative w-full h-[400px] rounded-xl bg-slate-950 p-8 border border-white/10 overflow-hidden shadow-2xl", className)}>
      {/* Dynamic Background Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Central Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full py-4">
        
        {/* TOP: The Secret / User */}
        <div className="relative">
          <div className={cn(
            "flex h-20 w-20 items-center justify-center rounded-full border-2 transition-all duration-700 bg-slate-900 z-20 relative",
            step === "processing" ? "border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.6)] scale-110" : "border-slate-700",
            step === "complete" ? "border-emerald-500 bg-emerald-950/30 shadow-[0_0_30px_rgba(16,185,129,0.5)]" : ""
          )}>
            {step === "complete" && mode === "combine" ? (
              <Check className="h-10 w-10 text-emerald-400" />
            ) : (
              <Key className={cn(
                "h-8 w-8 transition-colors duration-500", 
                step === "processing" ? "text-indigo-400 animate-pulse" : "text-slate-400",
                step === "complete" ? "text-emerald-400" : ""
              )} />
            )}
          </div>
          <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-28 text-xs text-slate-400 font-mono text-left">
            {mode === "split" ? "Master Secret" : "Reconstructed Key"}
          </div>
        </div>

        {/* MIDDLE: The Algorithm (Polynomial) */}
        <div className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700",
          step === "processing" ? "opacity-100 scale-100" : "opacity-30 scale-90 blur-sm"
        )}>
          <div className="flex flex-col items-center justify-center">
             {step === "processing" && (
                <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20" />
             )}
             <Shield className={cn(
               "h-16 w-16 transition-all duration-500",
               step === "processing" ? "text-indigo-500" : "text-slate-800"
             )} />
             {step === "processing" && (
               <span className="mt-2 font-mono text-[10px] text-indigo-400 animate-pulse">
                 f(x) = S + a₁x + ... + aₜ₋₁xᵗ⁻¹
               </span>
             )}
          </div>
        </div>

        {/* PARTICLES: Moving Shares */}
        {step === "distributing" && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: n }).map((_, i) => (
              <ShareParticle 
                key={i} 
                index={i} 
                total={n} 
                mode={mode} 
              />
            ))}
          </div>
        )}

        {/* BOTTOM: The Guardians */}
        <div className="flex w-full justify-center gap-4 mt-auto px-4">
          {Array.from({ length: n }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 transition-all duration-500"
                 style={{ 
                   transform: step === "distributing" || step === "complete" ? "translateY(0)" : "translateY(10px)",
                   opacity: step === "distributing" || step === "complete" ? 1 : 0.5
                 }}>
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 bg-slate-900",
                step === "complete" ? "border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "border-slate-800",
                step === "distributing" ? "border-indigo-500/50" : ""
              )}>
                <User className={cn(
                  "h-5 w-5",
                  step === "complete" ? "text-emerald-400" : "text-slate-500"
                )} />
              </div>
              <div className={cn(
                "text-[10px] font-mono transition-colors",
                step === "complete" ? "text-emerald-400" : "text-slate-600"
              )}>
                Guardian {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* STATUS TEXT */}
      <div className="absolute bottom-4 right-4 font-mono text-xs text-indigo-300/80 bg-slate-900/80 px-2 py-1 rounded border border-indigo-500/20">
        {step === "idle" && "Ready to initialize..."}
        {step === "processing" && "Generating Polynomial..."}
        {step === "distributing" && (mode === "split" ? "Distributing Shares..." : "Collecting Shares...")}
        {step === "complete" && "Secured & Distributed"}
      </div>
    </div>
  );
}

// Helper component for the moving particles
function ShareParticle({ index, total, mode }: { index: number; total: number; mode: "split" | "combine" }) {
  const isSplit = mode === "split";
  
  return (
    <div 
      className={cn(
        "absolute h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] flex items-center justify-center z-30",
        "transition-all"
      )}
      style={{
        left: "50%",
        top: isSplit ? "20%" : "85%", // Start position
        animation: `moveParticle${index} 2s forwards cubic-bezier(0.4, 0, 0.2, 1)`,
      }}
    >
      <style jsx>{`
        @keyframes moveParticle${index} {
          0% {
            left: 50%;
            top: ${isSplit ? "20%" : "85%"};
            opacity: 0;
            transform: scale(0);
          }
          10% {
            opacity: 1;
            transform: scale(1);
          }
          90% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            /* Calculate evenly spaced positions at the bottom */
            left: ${10 + (80 / (total - 1 || 1)) * index}%;
            top: ${isSplit ? "85%" : "20%"};
            opacity: 0;
            transform: scale(0.5);
          }
        }
      `}</style>
    </div>
  );
}
