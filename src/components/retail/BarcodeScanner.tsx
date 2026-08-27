import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types";
import { Html5QrcodeScanner } from "html5-qrcode";

interface BarcodeScannerProps {
  onDetect: (barcode: string) => void;
  products: Product[];
}

export function BarcodeScanner({ onDetect, products }: BarcodeScannerProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onDetect(manualCode.trim());
      setManualCode("");
    }
  };

  useEffect(() => {
    if (!isCameraActive) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error(e));
        scannerRef.current = null;
      }
      return;
    }

    // Initialize scanner
    const scanner = new Html5QrcodeScanner(
      "barcode-reader",
      { fps: 10, qrbox: { width: 250, height: 150 } },
      false
    );
    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        onDetect(decodedText);
        setIsCameraActive(false); // Auto off on success
      },
      (error) => {
        // Ignored
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error(e));
        scannerRef.current = null;
      }
    };
  }, [isCameraActive, onDetect]);

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Camera className="w-4 h-4 text-emerald-400" /> Scanner Barcode
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 bg-slate-800 border-slate-700 text-white hover:bg-slate-700 text-xs"
          onClick={() => setIsCameraActive(!isCameraActive)}
        >
          {isCameraActive ? "Matikan Kamera" : "Aktifkan Kamera"}
        </Button>
      </div>

      <div className="relative bg-black flex items-center justify-center min-h-[300px]" id="barcode-reader-container">
        {isCameraActive ? (
          <div id="barcode-reader" className="w-full text-white" />
        ) : (
          <div className="text-slate-600 text-sm font-medium">Kamera Nonaktif</div>
        )}
      </div>

      <div className="p-4 bg-slate-950">
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Atau input barcode manual & tekan Enter..."
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-emerald-500"
            autoFocus
          />
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-6">
            Cari
          </Button>
        </form>
      </div>
    </div>
  );
}
