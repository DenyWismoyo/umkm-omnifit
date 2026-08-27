import React from "react";
import { IceLevel, SugarLevel } from "@/types";

interface LevelBadgeProps {
  type: "ice" | "sugar";
  level?: IceLevel | SugarLevel;
}

export function LevelBadge({ type, level }: LevelBadgeProps) {
  if (!level || level === "normal") return null;

  const getColors = (type: "ice" | "sugar", level: string) => {
    if (type === "ice") {
      switch (level) {
        case "less":
          return "bg-cyan-100 text-cyan-800 border-cyan-200";
        case "no":
          return "bg-rose-100 text-rose-800 border-rose-200";
        case "extra":
          return "bg-blue-100 text-blue-800 border-blue-300 font-bold";
      }
    } else {
      switch (level) {
        case "less":
          return "bg-amber-100 text-amber-800 border-amber-200";
        case "no":
          return "bg-emerald-100 text-emerald-800 border-emerald-200";
        case "extra":
          return "bg-orange-100 text-orange-800 border-orange-300 font-bold";
      }
    }
    return "bg-slate-100 text-slate-800 border-slate-200";
  };

  const getLabel = (type: "ice" | "sugar", level: string) => {
    const prefix = type === "ice" ? "❄️ Ice" : "🧂 Sugar";
    return `${prefix}: ${level.toUpperCase()}`;
  };

  return (
    <span
      className={`text-[9px] px-1.5 py-0.5 rounded-md border inline-block mt-0.5 ${getColors(
        type,
        level
      )}`}
    >
      {getLabel(type, level)}
    </span>
  );
}
