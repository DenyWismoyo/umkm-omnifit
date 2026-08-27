import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { collection, query, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function NewAppointmentModal({ isOpen, onClose, stylists, services }: { isOpen: boolean, onClose: () => void, stylists: any[], services: any[] }) {
  const { user, storeOwnerUid } = useAuth();
  const activeUid = storeOwnerUid || user?.uid;

  const [customerName, setCustomerName] = useState("");
  const [stylistId, setStylistId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUid || !stylistId || !date || !time) return;

    setLoading(true);
    try {
      const scheduledAt = new Date(`${date}T${time}`).toISOString();
      const scheduledTimeMs = new Date(scheduledAt).getTime();
      const durationMinutes = 60; // default 1 hour for now

      // Double Booking Detection
      const q = query(collection(db, "users", activeUid, "salon_appointments"));
      const snapshot = await getDocs(q);
      const appointments = snapshot.docs.map(d => d.data());

      let isConflict = false;
      for (const apt of appointments) {
        if (apt.stylistId === stylistId && apt.status !== "cancelled" && apt.status !== "completed") {
          const aptStart = new Date(apt.scheduledAt).getTime();
          const aptEnd = aptStart + (apt.durationMinutes * 60000);
          const newStart = scheduledTimeMs;
          const newEnd = scheduledTimeMs + (durationMinutes * 60000);

          if ((newStart >= aptStart && newStart < aptEnd) || (newEnd > aptStart && newEnd <= aptEnd)) {
            isConflict = true;
            break;
          }
        }
      }

      if (isConflict) {
        toast.error("Kapster ini sudah dibooking pada jam tersebut! Silakan pilih kapster atau jam lain.", { duration: 5000 });
        setLoading(false);
        return;
      }

      const stylistName = stylists.find(s => s.id === stylistId)?.name || "Unknown";

      await addDoc(collection(db, "users", activeUid, "salon_appointments"), {
        customerName,
        stylistId,
        stylistName,
        scheduledAt,
        durationMinutes,
        status: "scheduled",
        createdAt: new Date().toISOString()
      });

      toast.success("Reservasi berhasil ditambahkan!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menambahkan reservasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Reservasi Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="text-xs font-bold text-slate-500">Nama Pelanggan</label>
            <input required type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full mt-1 border border-slate-200 bg-white text-slate-900 rounded-xl p-2.5 text-sm" placeholder="Nama Pelanggan" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500">Pilih Kapster</label>
            <select required value={stylistId} onChange={e => setStylistId(e.target.value)} className="w-full mt-1 border border-slate-200 bg-white text-slate-900 rounded-xl p-2.5 text-sm">
              <option value="">-- Pilih Kapster --</option>
              {stylists.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500">Tanggal</label>
              <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full mt-1 border border-slate-200 bg-white text-slate-900 rounded-xl p-2.5 text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">Jam</label>
              <input required type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full mt-1 border border-slate-200 bg-white text-slate-900 rounded-xl p-2.5 text-sm" />
            </div>
          </div>
          <Button disabled={loading} type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold">
            Simpan Reservasi
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
