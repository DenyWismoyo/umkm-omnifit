import React from "react";
import { Stylist } from "@/types";
import { Scissors, UserCheck, UserX } from "lucide-react";

interface StylistCardProps {
  stylist: Stylist;
}

export function StylistCard({ stylist }: StylistCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${stylist.isActive ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-400"}`}>
              <Scissors className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">{stylist.name}</h4>
              <p className="text-xs text-slate-500">{stylist.phone || "No Phone"}</p>
            </div>
          </div>
          {stylist.isActive ? (
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <UserCheck className="w-3 h-3" /> Aktif
            </span>
          ) : (
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <UserX className="w-3 h-3" /> Nonaktif
            </span>
          )}
        </div>
        
        <div className="mt-4 bg-slate-50 p-2 rounded-xl border border-slate-100 flex justify-between items-center">
          <span className="text-xs text-slate-500">Komisi per Treatment</span>
          <span className="font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-lg text-sm">
            {stylist.commissionRate}%
          </span>
        </div>
      </div>
    </div>
  );
}
