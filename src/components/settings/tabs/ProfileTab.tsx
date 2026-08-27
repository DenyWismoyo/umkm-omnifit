"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Store } from "lucide-react";

interface ProfileTabProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function ProfileTab({ formData, setFormData }: ProfileTabProps) {
  return (
    <div className="animate-in fade-in duration-200 space-y-6">
      <Card>
        <CardHeader className="pb-4 border-b border-slate-100">
          <CardTitle className="text-base flex items-center gap-2">
            <Store className="h-5 w-5 text-emerald-600" />
            <span>Identitas Toko / Usaha</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Informasi ini akan tercetak di bagian atas struk kasir dan faktur penjualan.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Nama Toko / Usaha <span className="text-rose-500">*</span>
              </label>
              <Input
                required
                value={formData.shopName}
                onChange={(e) =>
                  setFormData({ ...formData, shopName: e.target.value })
                }
                placeholder="Contoh: Toko Berkah Sejahtera"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Nama Pemilik / Kasir Utama
              </label>
              <Input
                value={formData.ownerName}
                onChange={(e) =>
                  setFormData({ ...formData, ownerName: e.target.value })
                }
                placeholder="Nama Anda"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Nomor WhatsApp / HP Toko
              </label>
              <Input
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                placeholder="081234567890"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Alamat Lengkap Toko
              </label>
              <Input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Jl. Mawar No. 12, Jakarta"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
