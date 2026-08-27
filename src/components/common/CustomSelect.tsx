"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CustomSelectOption {
  value: string;
  label: string;
  shortLabel?: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  emoji?: string;
  badge?: string | number;
  description?: string;
  group?: string;
}

export interface CustomSelectGroup {
  id: string;
  label: string;
  icon?: string;
}

interface CustomSelectProps {
  options: CustomSelectOption[];
  groups?: CustomSelectGroup[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  menuClassName?: string;
  size?: "sm" | "md" | "lg";
}

export function CustomSelect({
  options,
  groups,
  value,
  onChange,
  placeholder = "Pilih opsi...",
  className,
  menuClassName,
  size = "md",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const SelectedIcon = selectedOption?.icon;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "touch-press w-full flex items-center justify-between gap-2 rounded-2xl bg-white border border-slate-200/90 px-3.5 text-slate-900 shadow-2xs transition-all text-left",
          isOpen
            ? "ring-2 ring-emerald-500/20 border-emerald-500"
            : "hover:border-slate-300 hover:bg-slate-50/50",
          size === "sm" ? "h-9 text-xs" : size === "lg" ? "h-12 text-sm" : "h-11 text-xs sm:text-sm font-bold"
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {selectedOption?.emoji && (
            <span className="text-base shrink-0">{selectedOption.emoji}</span>
          )}
          {SelectedIcon && (
            <SelectedIcon className="h-4 w-4 text-emerald-600 shrink-0" />
          )}
          <div className="min-w-0 flex-1 truncate">
            <span className="font-extrabold text-slate-900 truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          {selectedOption?.badge && (
            <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180 text-emerald-600"
          )}
        />
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div
          className={cn(
            "absolute left-0 right-0 z-50 mt-1.5 max-h-72 overflow-y-auto rounded-2xl bg-white border border-slate-200/90 p-1.5 shadow-xl shadow-slate-900/10 no-scrollbar animate-in fade-in-0 zoom-in-95 duration-150",
            menuClassName
          )}
        >
          {groups && groups.length > 0 ? (
            // Grouped Options
            groups.map((group) => {
              const groupOptions = options.filter((opt) => opt.group === group.id);
              if (groupOptions.length === 0) return null;

              return (
                <div key={group.id} className="mb-2 last:mb-0">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50/80 rounded-lg mb-1">
                    {group.icon && <span>{group.icon}</span>}
                    <span>{group.label}</span>
                  </div>
                  <div className="space-y-0.5">
                    {groupOptions.map((opt) => {
                      const isSelected = opt.value === value;
                      const Icon = opt.icon;

                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelect(opt.value)}
                          className={cn(
                            "touch-press w-full flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all text-left",
                            isSelected
                              ? "bg-emerald-50 text-emerald-950 font-bold border border-emerald-200/80 shadow-2xs"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          )}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {opt.emoji && <span className="text-sm shrink-0">{opt.emoji}</span>}
                            {Icon && (
                              <Icon
                                className={cn(
                                  "h-4 w-4 shrink-0",
                                  isSelected ? "text-emerald-600" : "text-slate-400"
                                )}
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <span className="block truncate">{opt.label}</span>
                              {opt.description && (
                                <span className="block text-[10px] text-slate-400 truncate">
                                  {opt.description}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {opt.badge && (
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-[9px] font-extrabold",
                                  isSelected
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-100 text-slate-600"
                                )}
                              >
                                {opt.badge}
                              </span>
                            )}
                            {isSelected && (
                              <Check className="h-4 w-4 text-emerald-600 stroke-[2.5]" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            // Flat Options List
            <div className="space-y-0.5">
              {options.map((opt) => {
                const isSelected = opt.value === value;
                const Icon = opt.icon;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "touch-press w-full flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all text-left",
                      isSelected
                        ? "bg-emerald-50 text-emerald-950 font-bold border border-emerald-200/80 shadow-2xs"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {opt.emoji && <span className="text-sm shrink-0">{opt.emoji}</span>}
                      {Icon && (
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isSelected ? "text-emerald-600" : "text-slate-400"
                          )}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="block truncate">{opt.label}</span>
                        {opt.description && (
                          <span className="block text-[10px] text-slate-400 truncate">
                            {opt.description}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {opt.badge && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[9px] font-extrabold",
                            isSelected
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          )}
                        >
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && (
                        <Check className="h-4 w-4 text-emerald-600 stroke-[2.5]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
