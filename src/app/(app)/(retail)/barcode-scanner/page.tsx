"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { FeatureGate } from "@/components/common/FeatureGate";
import { BarcodeScanner } from "@/components/retail/BarcodeScanner";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Info } from "lucide-react";
import { toast } from "sonner";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatRupiah } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function BarcodeScannerPage() {
  const { user, storeOwnerUid } = useAuth();
  const activeUid = storeOwnerUid || user?.uid;
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!activeUid) return;
    const q = query(collection(db, "users", activeUid, "products"));
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      setLoading(false);
    });
    return () => unsub();
  }, [activeUid]);

  const handleDetect = (barcode: string) => {
    const found = products.find(p => p.barcode === barcode);
    if (found) {
      setScannedProduct(found);
      toast.success(`Produk ditemukan: ${found.name}`);
    } else {
      setScannedProduct(null);
      toast.error(`Barcode ${barcode} tidak terdaftar di database!`);
    }
  };

  return (
    <DashboardLayout>
      <FeatureGate
        requiredTier="basic" // Basic+ can access
        requiredIndustry={["retail"]}
        featureName="Barcode Scanner & Opname"
        description="Fitur pemindai barcode untuk minimarket/retail untuk mempercepat kasir dan stok opname."
      >
        <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto pb-12">
          <PageHeader
            title="Kamera Barcode Scanner"
            description="Pindai barcode produk untuk melihat detail atau tambah langsung ke POS."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <BarcodeScanner onDetect={handleDetect} products={products} />
              <div className="bg-blue-50 text-blue-800 p-4 rounded-2xl text-xs flex gap-3 items-start border border-blue-200">
                <Info className="w-5 h-5 shrink-0 text-blue-600" />
                <p>
                  Arahkan kamera ke barcode produk. Pastikan cahaya cukup agar fokus cepat didapatkan.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {scannedProduct ? (
                <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm shadow-emerald-500/10">
                  <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase rounded-full mb-4">
                    Produk Ditemukan
                  </div>
                  
                  <h3 className="font-black text-xl text-slate-800 mb-1">{scannedProduct.name}</h3>
                  <p className="text-slate-500 text-sm mb-6 font-mono">{scannedProduct.barcode}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Harga Jual</span>
                      <span className="font-black text-slate-800">{formatRupiah(scannedProduct.sellingPrice)}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Stok Tersedia</span>
                      <span className={`font-black ${scannedProduct.stock <= (scannedProduct.minStockAlert || 5) ? 'text-rose-600' : 'text-slate-800'}`}>
                        {scannedProduct.stock} {scannedProduct.unit}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => router.push(`/products`)} variant="outline" className="flex-1 font-bold">
                      Edit Master
                    </Button>
                    <Button onClick={() => router.push(`/pos?scan=${scannedProduct.barcode}`)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 font-bold text-white">
                      <ShoppingCart className="w-4 h-4 mr-2" /> POS
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 border-dashed flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-slate-400" />
                  </div>
                  <h4 className="font-bold text-slate-700 mb-2">Menunggu Pemindaian</h4>
                  <p className="text-xs text-slate-500 max-w-[250px]">
                    Hasil pemindaian produk akan muncul di sini beserta opsi aksi lanjutannya.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </FeatureGate>
    </DashboardLayout>
  );
}
