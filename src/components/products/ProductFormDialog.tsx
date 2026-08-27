"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { SearchableSelect } from "@/components/shared/forms/SearchableSelect";
import { Product, Category } from "@/types";
import { toast } from "sonner";
import { compressImage } from "@/lib/imageCompressor";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

const productSchema = z
  .object({
    name: z.string().min(1, "Nama produk wajib diisi"),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    categoryId: z.string().min(1, "Kategori wajib dipilih"),
    costPrice: z.number().min(0, "Harga modal minimal 0"),
    sellingPrice: z.number().min(0, "Harga jual minimal 0"),
    stock: z.number().min(0, "Stok minimal 0"),
    minStockAlert: z.number().min(0, "Peringatan stok minimal 0"),
    unit: z.string().min(1, "Satuan wajib diisi (contoh: Pcs, Cup)"),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    isAvailable: z.boolean(),
  })
  .refine((data) => data.sellingPrice >= data.costPrice, {
    message: "Harga Jual tidak boleh lebih kecil dari Harga Modal",
    path: ["sellingPrice"],
  });

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  initialData?: Product | null;
  onSave: (data: ProductFormValues) => Promise<void>;
  activeUid: string;
}

export function ProductFormDialog({
  isOpen,
  onClose,
  categories,
  initialData,
  onSave,
  activeUid,
}: ProductFormDialogProps) {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      barcode: "",
      categoryId: "",
      costPrice: 0,
      sellingPrice: 0,
      stock: 0,
      minStockAlert: 5,
      unit: "Pcs",
      description: "",
      imageUrl: "",
      isAvailable: true,
    },
  });

  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        name: initialData.name,
        sku: initialData.sku || "",
        barcode: initialData.barcode || "",
        categoryId: initialData.categoryId || "",
        costPrice: initialData.costPrice || 0,
        sellingPrice: initialData.sellingPrice || 0,
        stock: initialData.stock || 0,
        minStockAlert: initialData.minStockAlert || 5,
        unit: initialData.unit || "Pcs",
        description: initialData.description || "",
        imageUrl: initialData.imageUrl || "",
        isAvailable: initialData.isAvailable ?? true,
      });
    } else if (isOpen) {
      reset({
        name: "",
        sku: "",
        barcode: "",
        categoryId: "",
        costPrice: 0,
        sellingPrice: 0,
        stock: 0,
        minStockAlert: 5,
        unit: "Pcs",
        description: "",
        imageUrl: "",
        isAvailable: true,
      });
    }
  }, [isOpen, initialData, reset]);

  const imageUrl = watch("imageUrl");

  const onSubmit = async (data: ProductFormValues) => {
    try {
      await onSave(data);
      onClose();
    } catch (err: any) {
      toast.error("Gagal menyimpan produk: " + err.message);
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUid) return;

    try {
      setIsUploadingImage(true);
      toast.loading("Mengompresi gambar produk...", { id: "compress-img" });

      const compressed = await compressImage(file, {
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.8,
        mimeType: "image/webp",
      });

      toast.loading("Mengunggah foto produk...", { id: "compress-img" });

      try {
        const storageRef = ref(
          storage,
          `users/${activeUid}/products/prod_${Date.now()}.webp`
        );
        const snap = await uploadBytes(storageRef, compressed.file);
        const downloadUrl = await getDownloadURL(snap.ref);
        setValue("imageUrl", downloadUrl);
        toast.success(
          `Foto berhasil dikompresi dan diunggah!`,
          { id: "compress-img" }
        );
      } catch (storageErr) {
        console.warn("Storage upload fallback to base64", storageErr);
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          setValue("imageUrl", base64);
          toast.success(`Foto berhasil disimpan (Mode Offline)!`, { id: "compress-img" });
        };
        reader.readAsDataURL(compressed.file);
      }
    } catch (err: any) {
      toast.error("Gagal mengunggah foto: " + (err?.message || "Error"), {
        id: "compress-img",
      });
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-white border-slate-200">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Produk" : "Tambah Produk Baru"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1 py-2">
          {/* FOTO PRODUK */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all bg-slate-50 ${
                  imageUrl ? "border-emerald-500" : "border-slate-300 hover:border-emerald-400"
                }`}
              >
                {isUploadingImage ? (
                  <div className="flex flex-col items-center text-emerald-600">
                    <Loader2 className="h-6 w-6 animate-spin mb-2" />
                    <span className="text-[10px] font-bold">Mengunggah...</span>
                  </div>
                ) : imageUrl ? (
                  <div className="w-full h-full relative">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setValue("imageUrl", "")}
                      className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center text-slate-400 cursor-pointer w-full h-full justify-center"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-8 w-8 mb-1" />
                    <span className="text-[10px] font-semibold">Upload Foto</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageFileChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Nama Produk *</label>
              <Input {...register("name")} placeholder="Contoh: Kopi Gula Aren" className="h-10 text-sm bg-slate-50" />
              {errors.name && <p className="text-[10px] text-rose-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">SKU / Kode (Opsional)</label>
              <Input {...register("sku")} placeholder="Contoh: KOP-01" className="h-10 text-sm bg-slate-50" />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Kategori *</label>
              <SearchableSelect
                options={categoryOptions}
                value={watch("categoryId")}
                onChange={(val) => setValue("categoryId", val)}
                placeholder="Pilih Kategori..."
              />
              {errors.categoryId && <p className="text-[10px] text-rose-500">{errors.categoryId.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Harga Modal (HPP)</label>
              <CurrencyInput
                value={watch("costPrice")}
                onChange={(val) => setValue("costPrice", val)}
                placeholder="Rp 0"
              />
              {errors.costPrice && <p className="text-[10px] text-rose-500">{errors.costPrice.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Harga Jual *</label>
              <CurrencyInput
                value={watch("sellingPrice")}
                onChange={(val) => setValue("sellingPrice", val)}
                placeholder="Rp 0"
              />
              {errors.sellingPrice && <p className="text-[10px] text-rose-500">{errors.sellingPrice.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Stok Saat Ini</label>
              <Input type="number" {...register("stock", { valueAsNumber: true })} className="h-10 text-sm bg-slate-50" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Batas Peringatan Stok</label>
              <Input type="number" {...register("minStockAlert", { valueAsNumber: true })} className="h-10 text-sm bg-slate-50" />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Satuan (Pcs, Cup, Kg, dll) *</label>
              <Input {...register("unit")} placeholder="Contoh: Cup" className="h-10 text-sm bg-slate-50" />
              {errors.unit && <p className="text-[10px] text-rose-500">{errors.unit.message}</p>}
            </div>
            
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Deskripsi (Opsional)</label>
              <Input {...register("description")} placeholder="Deskripsi singkat produk" className="h-10 text-sm bg-slate-50" />
            </div>
          </div>

          <DialogFooter className="mt-6 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploadingImage} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Produk"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
