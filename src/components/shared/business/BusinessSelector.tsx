"use client";

import React from "react";
import { INDUSTRY_METADATA } from "@/data/subscriptionPlans";
import { IndustryPack } from "@/types";
import { cn } from "@/lib/utils";

interface BusinessSelectorProps {
  onSelect: (industry: IndustryPack) => void;
  selectedIndustry?: IndustryPack | null;
  isLoading?: boolean;
}

export function BusinessSelector({ onSelect, selectedIndustry, isLoading }: BusinessSelectorProps) {
  const industries = Object.values(INDUSTRY_METADATA);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="business-selector">
      {industries.map((meta) => {
        const isSelected = selectedIndustry === meta.id;
        
        return (
          <div
            key={meta.id}
            onClick={() => !isLoading && onSelect(meta.id)}
            className={cn(
              "relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 overflow-hidden group",
              isSelected
                ? `border-${meta.accentBg.split("-")[1]}-500 bg-${meta.accentBg.split("-")[1]}-50 shadow-md`
                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            {/* Background Icon Watermark */}
            <div className="absolute -right-4 -bottom-4 text-7xl opacity-5 transition-transform group-hover:scale-110">
              {meta.icon}
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center text-2xl shadow-sm", meta.badgeBg)}>
                  {meta.icon}
                </div>
                <h3 className={cn("font-bold text-lg leading-tight", isSelected ? meta.color : "text-slate-900")}>
                  {meta.name}
                </h3>
              </div>
              
              <p className="text-xs text-slate-600 mb-4 flex-grow">
                {meta.targetBusiness}
              </p>
              
              <div className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md self-start", meta.badgeBg)}>
                {meta.shortName}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
