import React from "react";
import { SalonService } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Clock, Scissors, Activity, Droplets } from "lucide-react";

interface ServiceCardProps {
  service: SalonService;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const getIcon = () => {
    switch (service.category) {
      case "Hair": return <Scissors className="w-4 h-4" />;
      case "Body": return <Activity className="w-4 h-4" />;
      case "Nail": return <Droplets className="w-4 h-4" />; // generic drop
      default: return <Scissors className="w-4 h-4" />;
    }
  };

  const getCategoryColor = () => {
    switch (service.category) {
      case "Hair": return "bg-rose-100 text-rose-800";
      case "Body": return "bg-emerald-100 text-emerald-800";
      case "Nail": return "bg-purple-100 text-purple-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className={`bg-white rounded-2xl border ${service.isActive ? "border-slate-200" : "border-dashed border-slate-300 opacity-60"} shadow-sm p-4 space-y-3`}>
      <div className="flex justify-between items-start">
        <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded flex items-center gap-1 w-fit ${getCategoryColor()}`}>
          {getIcon()} {service.category}
        </span>
        <span className="font-black text-slate-800">{formatRupiah(service.price)}</span>
      </div>
      
      <div>
        <h4 className="font-bold text-slate-900 text-sm leading-tight">{service.name}</h4>
        <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 font-bold">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {service.durationMinutes} Menit</span>
        </div>
      </div>

      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
        <span className="text-slate-500">Tipe Komisi</span>
        <span className="font-bold text-slate-700">
          {service.commissionType === "percentage" ? `${service.commissionValue}%` : formatRupiah(service.commissionValue)}
        </span>
      </div>
    </div>
  );
}
