"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/shared/forms/CurrencyInput";
import { Customer } from "@/types";
import { Loader2 } from "lucide-react";

// --- ADD CUSTOMER MODAL ---

const addCustomerSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type AddCustomerFormValues = z.infer<typeof addCustomerSchema>;

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AddCustomerFormValues) => Promise<void>;
}

export function AddCustomerModal({ isOpen, onClose, onSave }: AddCustomerModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddCustomerFormValues>({
    resolver: zodResolver(addCustomerSchema),
    defaultValues: { name: "", phone: "", address: "" },
  });

  useEffect(() => {
    if (isOpen) reset({ name: "", phone: "", address: "" });
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Daftarkan Pelanggan Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(async (d) => { await onSave(d); onClose(); })} className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold">Nama Pelanggan *</label>
            <Input {...register("name")} placeholder="Contoh: Budi Santoso" className="h-10 text-sm" />
            {errors.name && <p className="text-[10px] text-rose-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold">Nomor WhatsApp</label>
            <Input {...register("phone")} placeholder="0812xxxxxx" className="h-10 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold">Alamat</label>
            <Input {...register("address")} placeholder="Alamat pelanggan" className="h-10 text-sm" />
          </div>
          <DialogFooter className="mt-6 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Batal</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan</> : "Simpan Pelanggan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- SETTLE DEBT MODAL ---

const settleDebtSchema = z.object({
  amount: z.number().min(1, "Nominal wajib diisi"),
  method: z.enum(["cash", "transfer", "qris"]),
  notes: z.string().optional(),
});

export type SettleDebtFormValues = z.infer<typeof settleDebtSchema>;

interface SettleDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSave: (data: SettleDebtFormValues) => Promise<void>;
}

export function SettleDebtModal({ isOpen, onClose, customer, onSave }: SettleDebtModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettleDebtFormValues>({
    resolver: zodResolver(settleDebtSchema),
    defaultValues: { amount: 0, method: "cash", notes: "" },
  });

  useEffect(() => {
    if (isOpen && customer) {
      reset({ amount: customer.totalDebt, method: "cash", notes: "" });
    }
  }, [isOpen, customer, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Catat Pelunasan Piutang</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(async (d) => { await onSave(d); onClose(); })} className="space-y-4 py-2">
          {customer && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl mb-4">
              <span className="text-xs text-amber-800">Pelanggan:</span>
              <p className="font-bold text-amber-950">{customer.name}</p>
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-semibold">Nominal Pembayaran (Rp) *</label>
            <CurrencyInput value={watch("amount")} onChange={(v) => setValue("amount", v)} placeholder="Rp 0" />
            {errors.amount && <p className="text-[10px] text-rose-500">{errors.amount.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold">Metode Pembayaran</label>
            <select {...register("method")} className="w-full h-10 rounded-xl border border-slate-200 bg-white text-slate-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="cash">Tunai (Cash)</option>
              <option value="transfer">Transfer Bank</option>
              <option value="qris">QRIS</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold">Catatan</label>
            <Input {...register("notes")} placeholder="Keterangan tambahan" className="h-10 text-sm" />
          </div>
          <DialogFooter className="mt-6 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Batal</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-amber-600 hover:bg-amber-700 text-white font-bold">
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Memproses</> : "Catat Pelunasan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
