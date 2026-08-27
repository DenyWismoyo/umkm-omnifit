import React from "react";
import { Coffee, CheckCircle2, Gift } from "lucide-react";
import { LoyaltyCard } from "@/types";

interface LoyaltyCardDisplayProps {
  card: LoyaltyCard;
  maxStamps?: number;
}

export function LoyaltyCardDisplay({ card, maxStamps = 10 }: LoyaltyCardDisplayProps) {
  const currentStamps = card.stampsCurrentCard;
  const isFull = currentStamps >= maxStamps;

  // Generate array for visual stamps
  const stamps = Array.from({ length: maxStamps }, (_, i) => i + 1);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3C2A21] to-[#1A110B] p-5 shadow-xl text-[#F9F5F0]">
      {/* Background Decor */}
      <div className="absolute -right-6 -top-6 opacity-10">
        <Coffee className="h-32 w-32" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-black text-lg uppercase tracking-widest text-[#EAE0D5]">
              Coffee Loyalty
            </h3>
            <p className="text-xs text-[#A4907C] font-medium mt-0.5">
              Get 1 FREE drink every {maxStamps} stamps!
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-[#A4907C]">Member</p>
            <p className="font-bold">{card.customerName}</p>
          </div>
        </div>

        {/* Stamps Grid */}
        <div className="grid grid-cols-5 gap-3">
          {stamps.map((num) => {
            const isStamped = num <= currentStamps;
            const isGift = num === maxStamps;

            return (
              <div
                key={num}
                className={`relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 transition-all ${
                  isStamped
                    ? "border-[#8B5E3C] bg-[#8B5E3C]"
                    : "border-dashed border-[#A4907C]/40 bg-[#2A1D15]/50"
                }`}
              >
                {isStamped ? (
                  <CheckCircle2 className="h-6 w-6 text-[#F9F5F0]" />
                ) : isGift ? (
                  <Gift className="h-5 w-5 text-[#A4907C]/40" />
                ) : (
                  <span className="font-bold text-[#A4907C]/40 text-xs">
                    {num}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[#A4907C]/20 pt-4">
          <div className="text-xs text-[#A4907C]">
            Total lifetime stamps: <strong className="text-white">{card.stampsTotal}</strong>
          </div>
          {isFull && (
            <span className="animate-pulse font-black text-emerald-400 text-sm">
              ✨ Free Drink Available!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
