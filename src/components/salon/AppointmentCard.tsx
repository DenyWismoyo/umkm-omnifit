import React from "react";
import { Appointment } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Calendar, Clock, Scissors, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppointmentCardProps {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const dateObj = new Date(appointment.scheduledAt);
  const isCompleted = appointment.status === "completed";
  const isCancelled = appointment.status === "cancelled";
  
  return (
    <div className={`rounded-2xl border p-4 space-y-3 ${
      isCancelled ? "bg-slate-50 border-slate-200 opacity-70" :
      isCompleted ? "bg-emerald-50/50 border-emerald-200" :
      "bg-white border-slate-200 shadow-sm"
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">{appointment.customerName}</h4>
            <p className="text-[10px] text-slate-500">{appointment.customerPhone || "Walk-in"}</p>
          </div>
        </div>
        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
          isCancelled ? "bg-slate-200 text-slate-600" :
          isCompleted ? "bg-emerald-100 text-emerald-800" :
          "bg-blue-100 text-blue-800"
        }`}>
          {appointment.status}
        </span>
      </div>

      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 grid grid-cols-2 gap-2 text-[10px]">
        <div className="flex items-center gap-1.5 text-slate-600 font-bold">
          <Calendar className="w-3 h-3 text-slate-400" />
          {dateObj.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 font-bold">
          <Clock className="w-3 h-3 text-slate-400" />
          {dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} ({appointment.durationMinutes}m)
        </div>
        <div className="col-span-2 flex items-center gap-1.5 text-rose-600 font-bold mt-1 pt-1 border-t border-slate-200/60">
          <Scissors className="w-3 h-3" />
          Kapster: {appointment.stylistName}
        </div>
      </div>

      <div className="flex justify-between items-center text-xs">
        <div className="text-slate-500 font-medium truncate max-w-[150px]">
          {appointment.serviceNames.join(", ")}
        </div>
        <div className="font-black text-slate-800">
          {formatRupiah(appointment.totalPrice)}
        </div>
      </div>

      {!isCompleted && !isCancelled && (
        <div className="pt-2 flex gap-2">
           <Button className="flex-1 h-8 text-[10px] bg-slate-900 text-white rounded-xl">POS / Bayar</Button>
        </div>
      )}
    </div>
  );
}
