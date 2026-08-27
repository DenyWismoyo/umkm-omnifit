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
import { Expense } from "@/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const EXPENSE_CATEGORIES = [
  "Bahan Baku & Suplai",
  "Gaji Karyawan",
  "Sewa Tempat",
  "Listrik, Air & Gas",
  "Internet & Komunikasi",
  "Pemasaran & Promosi",
  "Transportasi & Bensin",
  "Perawatan & Perbaikan",
  "Peralatan & Perlengkapan",
  "Lain-lain",
];

const expenseSchema = z.object({
  date: z.string().min(1, "Tanggal wajib diisi"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  amount: z.number().min(1, "Nominal pengeluaran harus lebih dari 0"),
  description: z.string().optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface ExpenseFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Expense | null;
  onSave: (data: ExpenseFormValues) => Promise<void>;
}

export function ExpenseFormDialog({
  isOpen,
  onClose,
  initialData,
  onSave,
}: ExpenseFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      category: EXPENSE_CATEGORIES[0],
      amount: 0,
      description: "",
    },
  });

  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        date: initialData.date || new Date().toISOString().slice(0, 10),
        category: initialData.category || EXPENSE_CATEGORIES[0],
        amount: initialData.amount || 0,
        description: initialData.description || "",
      });
    } else if (isOpen) {
      reset({
        date: new Date().toISOString().slice(0, 10),
        category: EXPENSE_CATEGORIES[0],
        amount: 0,
        description: "",
      });
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data: ExpenseFormValues) => {
    try {
      if (!data.description) {
        data.description = data.category;
      }
      await onSave(data);
      onClose();
    } catch (err: any) {
      toast.error("Gagal menyimpan pengeluaran: " + (err.message || "Error"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-slate-200">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Pengeluaran" : "Catat Pengeluaran Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Tanggal Pengeluaran *
            </label>
            <Input type="date" {...register("date")} className="h-10 text-sm bg-slate-50" />
            {errors.date && (
              <p className="text-[10px] text-rose-500">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Kategori Pengeluaran *
            </label>
            <select
              {...register("category")}
              className="w-full h-10 rounded-xl border border-slate-200 bg-white text-slate-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-[10px] text-rose-500">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Nominal Biaya (Rp) *
            </label>
            <CurrencyInput
              value={watch("amount")}
              onChange={(val) => setValue("amount", val)}
              placeholder="Rp 0"
            />
            {errors.amount && (
              <p className="text-[10px] text-rose-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Keterangan / Rincian
            </label>
            <Input
              {...register("description")}
              placeholder="Contoh: Beli token listrik PLN 200rb"
              className="h-10 text-sm bg-slate-50"
            />
          </div>

          <DialogFooter className="mt-6 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Pengeluaran"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
