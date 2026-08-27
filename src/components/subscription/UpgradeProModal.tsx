"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IndustryPack } from "@/types";

interface UpgradeProModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultIndustry?: IndustryPack;
  /** Nama fitur yang memicu modal (opsional, diteruskan ke /upgrade) */
  featureName?: string;
  /** Path asal untuk tombol "Kembali" di halaman /upgrade */
  fromPath?: string;
}

/**
 * UpgradeProModal — Thin Redirect Wrapper
 *
 * Modal ini tidak lagi menampilkan konten pricing secara langsung.
 * Saat isOpen = true, ia langsung me-redirect user ke halaman /upgrade
 * yang merupakan full-page industry-aware pricing view.
 *
 * Keuntungan:
 * - Tidak ada bug timing state (selectedIndustry vs activeIndustry)
 * - Konten pricing terpusat di satu tempat (/upgrade)
 * - Lebih banyak ruang untuk menampilkan fitur lengkap
 */
export function UpgradeProModal({
  isOpen,
  onClose,
  featureName,
  fromPath,
}: UpgradeProModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      // Tutup modal state sebelum redirect agar tidak ada overlay tertinggal
      onClose();

      // Bangun URL dengan query params
      const params = new URLSearchParams();
      if (featureName) params.set("feature", featureName);
      if (fromPath) params.set("from", fromPath);

      const queryString = params.toString();
      router.push(`/upgrade${queryString ? `?${queryString}` : ""}`);
    }
  }, [isOpen, onClose, featureName, fromPath, router]);

  // Tidak ada UI yang dirender — hanya redirect
  return null;
}
