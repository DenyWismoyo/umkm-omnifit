import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: number | string;
  onChange?: (value: number) => void;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    // Format number to IDR string: e.g. 150000 -> 150.000
    const formatIDR = (val: number | string) => {
      if (!val && val !== 0) return "";
      const numStr = val.toString().replace(/\D/g, "");
      return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        // Strip out non-digits
        const rawValue = e.target.value.replace(/\D/g, "");
        const numValue = rawValue ? parseInt(rawValue, 10) : 0;
        onChange(numValue);
      }
    };

    return (
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 pointer-events-none">
          Rp
        </div>
        <Input
          type="text"
          inputMode="numeric"
          ref={ref}
          value={formatIDR(value || "")}
          onChange={handleChange}
          className={cn("pl-9 font-medium tracking-wide", className)}
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
