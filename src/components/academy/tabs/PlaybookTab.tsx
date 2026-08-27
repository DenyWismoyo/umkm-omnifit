"use client";

import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/common/CustomSelect";
import { Search, X, Clock, ArrowRight } from "lucide-react";
import { AcademyArticle } from "@/data/academy";

interface PlaybookTabProps {
  CATEGORY_OPTIONS: any[];
  selectedArticleCategory: string;
  setSelectedArticleCategory: (val: string) => void;
  articleSearch: string;
  setArticleSearch: (val: string) => void;
  filteredArticles: AcademyArticle[];
  setSelectedArticle: (art: AcademyArticle) => void;
}

export function PlaybookTab({
  CATEGORY_OPTIONS,
  selectedArticleCategory,
  setSelectedArticleCategory,
  articleSearch,
  setArticleSearch,
  filteredArticles,
  setSelectedArticle,
}: PlaybookTabProps) {
  return (
    <TabsContent value="playbook" className="space-y-3 pt-1">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
        <div className="sm:col-span-5">
          <CustomSelect
            options={CATEGORY_OPTIONS}
            value={selectedArticleCategory}
            onChange={(val) => setSelectedArticleCategory(val as string)}
            size="sm"
            placeholder="Filter Kategori Pilar..."
          />
        </div>

        <div className="sm:col-span-7 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            type="text"
            value={articleSearch}
            onChange={(e) => setArticleSearch(e.target.value)}
            placeholder="Cari materi: diskon ojol, gaji owner, SOP kasir, yield..."
            className="pl-9 pr-8 h-9 bg-white border-slate-200/90 text-xs font-medium rounded-xl shadow-2xs focus:bg-white"
          />
          {articleSearch && (
            <button
              onClick={() => setArticleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="borderless-card touch-press p-3.5 sm:p-4 space-y-2 cursor-pointer flex flex-col justify-between hover:border-emerald-300 hover:shadow-xs transition-all"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-100">
                  {art.categoryLabel}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {art.readTime}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug">
                {art.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {art.summary}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-bold">
              <span>Baca Panduan</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        ))}
      </div>
    </TabsContent>
  );
}
