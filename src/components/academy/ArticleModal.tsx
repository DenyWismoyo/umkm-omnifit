"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Clock, Sparkles, BookOpen, CheckCircle2, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AcademyArticle } from "@/data/academy";
import { AcademyMarkdownRenderer } from "@/components/academy/AcademyMarkdownRenderer";

interface ArticleModalProps {
  selectedArticle: AcademyArticle | null;
  setSelectedArticle: (art: AcademyArticle | null) => void;
}

export function ArticleModal({ selectedArticle, setSelectedArticle }: ArticleModalProps) {
  if (!selectedArticle) return null;

  return (
    <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
      <DialogContent className="w-full max-w-3xl sm:rounded-3xl max-h-[92vh] sm:max-h-[85vh] p-0 overflow-hidden border-0 sm:border border-slate-200/80 shadow-2xl flex flex-col bg-white">
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              {selectedArticle.categoryLabel}
            </span>
            <span className="text-slate-400 text-[10px] flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {selectedArticle.readTime}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedArticle(null)}
            className="touch-press h-8 w-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3.5 space-y-3.5 text-xs">
          <DialogTitle className="text-base sm:text-lg font-black text-slate-900 leading-snug">
            {selectedArticle.title}
          </DialogTitle>

          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-3 space-y-1.5">
            <h4 className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Poin Kunci:</span>
            </h4>
            <ul className="space-y-1 pl-0.5">
              {selectedArticle.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-slate-700 text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {selectedArticle.caseStudy && (
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-3 space-y-1.5">
              <h4 className="font-extrabold text-amber-950 text-xs flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-amber-600" />
                <span>{selectedArticle.caseStudy.title}</span>
              </h4>
              <p className="text-slate-600 leading-relaxed italic text-[11px]">
                &ldquo;{selectedArticle.caseStudy.scenario}&rdquo;
              </p>
              <div className="bg-white p-2.5 rounded-lg border border-amber-200 text-slate-800 space-y-0.5 font-mono text-[10px]">
                <strong className="text-amber-900 block font-sans text-[11px]">Simulasi:</strong>
                <p>{selectedArticle.caseStudy.calculation}</p>
              </div>
              <p className="text-amber-900 font-semibold leading-tight text-[11px]">
                🎯 <strong>Pelajaran:</strong> {selectedArticle.caseStudy.lesson}
              </p>
            </div>
          )}

          <div className="py-1">
            <AcademyMarkdownRenderer content={selectedArticle.content} />
          </div>
        </div>

        <div className="mobile-safe-bottom px-4 sm:px-6 py-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSelectedArticle(null)}
            className="touch-press text-xs h-8 px-3"
          >
            Tutup
          </Button>

          {selectedArticle.actionLink && (
            <Link href={selectedArticle.actionLink.href}>
              <Button
                size="sm"
                className="touch-press bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1 text-xs h-8 px-3"
              >
                <span>{selectedArticle.actionLink.label}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
