"use client";

import React, { useState } from "react";
import {
  Check,
  Copy,
  Quote,
  Lightbulb,
  Sparkles,
  Calculator,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface AcademyMarkdownRendererProps {
  content: string;
}

export function AcademyMarkdownRenderer({ content }: AcademyMarkdownRendererProps) {
  // Helper to parse inline markdown (bold, italic, code, math)
  const renderInline = (text: string): React.ReactNode => {
    // Split by inline code, bold, italic
    // Regex matches: `code`, **bold**, *italic*, _italic_
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g);

    return parts.map((part, index) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        const codeText = part.slice(1, -1);
        return (
          <code
            key={index}
            className="font-mono bg-slate-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded text-[11px] border border-slate-200"
          >
            {codeText}
          </code>
        );
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        const boldText = part.slice(2, -2);
        return (
          <strong key={index} className="font-black text-slate-950">
            {boldText}
          </strong>
        );
      }
      if (
        (part.startsWith("*") && part.endsWith("*")) ||
        (part.startsWith("_") && part.endsWith("_"))
      ) {
        const italicText = part.slice(1, -1);
        return (
          <em key={index} className="italic text-slate-800">
            {italicText}
          </em>
        );
      }
      return part;
    });
  };

  // Split content into blocks (paragraphs, headings, blockquotes, lists, formulas)
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];

  let currentList: { type: "ol" | "ul"; items: string[] } | null = null;
  let currentQuote: string[] | null = null;

  const flushList = (key: string) => {
    if (!currentList) return;
    if (currentList.type === "ol") {
      elements.push(
        <div key={key} className="space-y-2 my-3 pl-1">
          {currentList.items.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-800">
                {idx + 1}
              </span>
              <div className="leading-relaxed flex-1 pt-0.5">
                {renderInline(item)}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      elements.push(
        <ul key={key} className="space-y-1.5 my-3 pl-2">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
              <div className="leading-relaxed flex-1">
                {renderInline(item)}
              </div>
            </li>
          ))}
        </ul>
      );
    }
    currentList = null;
  };

  const flushQuote = (key: string) => {
    if (!currentQuote || currentQuote.length === 0) return;
    const fullQuoteText = currentQuote.join("\n");
    elements.push(
      <QuoteCard key={key} text={fullQuoteText} renderInline={renderInline} />
    );
    currentQuote = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushList(`list-${i}`);
      flushQuote(`quote-${i}`);
      continue;
    }

    // Check if blockquote
    if (line.startsWith(">")) {
      flushList(`list-${i}`);
      const cleanQuoteLine = line.replace(/^>\s*/, "");
      if (!currentQuote) currentQuote = [];
      currentQuote.push(cleanQuoteLine);
      continue;
    } else {
      flushQuote(`quote-${i}`);
    }

    // Check if formula block (e.g. $$...$$ or contains \text)
    if (line.startsWith("$$") && line.endsWith("$$")) {
      flushList(`list-${i}`);
      const formulaText = line.replace(/\$\$/g, "");
      elements.push(
        <div
          key={`formula-${i}`}
          className="my-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 p-3.5 text-center shadow-xs"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1 flex items-center justify-center gap-1">
            <Calculator className="h-3.5 w-3.5 text-emerald-600" />
            <span>Formula / Rumus Praktis:</span>
          </span>
          <div className="font-mono text-xs font-black text-emerald-950 tracking-wide">
            {formulaText
              .replace(/\\text\{([^}]+)\}/g, "$1")
              .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 ÷ $2)")
              .replace(/\\times/g, "×")
              .replace(/\\left\(|\\right\)/g, "")}
          </div>
        </div>
      );
      continue;
    }

    // Check if Headings
    if (line.startsWith("#### ")) {
      flushList(`list-${i}`);
      elements.push(
        <h4
          key={`h4-${i}`}
          className="text-xs font-black text-slate-900 mt-4 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider text-emerald-800"
        >
          <ChevronRight className="h-3.5 w-3.5 text-emerald-600" />
          <span>{renderInline(line.replace(/^####\s+/, ""))}</span>
        </h4>
      );
      continue;
    }

    if (line.startsWith("### ")) {
      flushList(`list-${i}`);
      elements.push(
        <h3
          key={`h3-${i}`}
          className="text-sm font-black text-slate-950 mt-5 mb-2 pb-1.5 border-b border-slate-200/80 flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <span>{renderInline(line.replace(/^###\s+/, ""))}</span>
        </h3>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      flushList(`list-${i}`);
      elements.push(
        <h2
          key={`h2-${i}`}
          className="text-base font-black text-slate-950 mt-6 mb-2.5 pb-2 border-b-2 border-emerald-500"
        >
          {renderInline(line.replace(/^##\s+/, ""))}
        </h2>
      );
      continue;
    }

    // Check if Numbered list (e.g. "1. ", "2. ")
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      if (!currentList || currentList.type !== "ol") {
        flushList(`list-${i}`);
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(numMatch[2]);
      continue;
    }

    // Check if Bulleted list (e.g. "- ", "* ")
    const bulletMatch = line.match(/^[-*]\s+(.*)/);
    if (bulletMatch) {
      if (!currentList || currentList.type !== "ul") {
        flushList(`list-${i}`);
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(bulletMatch[1]);
      continue;
    }

    // Standard Paragraph
    flushList(`list-${i}`);
    elements.push(
      <p key={`p-${i}`} className="text-xs text-slate-700 leading-relaxed my-2">
        {renderInline(line)}
      </p>
    );
  }

  flushList("list-end");
  flushQuote("quote-end");

  return <div className="space-y-1">{elements}</div>;
}

function QuoteCard({
  text,
  renderInline,
}: {
  text: string;
  renderInline: (t: string) => React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text.replace(/[*_"]/g, ""));
    setCopied(true);
    toast.success("Template pesan berhasil disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-2xl border border-amber-300 bg-amber-50/70 p-4 relative shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
          <Quote className="h-3.5 w-3.5 text-amber-600" />
          <span>Template Pesan WhatsApp / Catatan SOP:</span>
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 hover:text-amber-950 bg-white/80 hover:bg-white px-2 py-1 rounded-lg border border-amber-200 transition-colors shadow-2xs"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span>Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Salin Teks</span>
            </>
          )}
        </button>
      </div>
      <p className="text-xs text-slate-800 leading-relaxed italic whitespace-pre-line bg-white/70 p-3 rounded-xl border border-amber-100">
        {renderInline(text)}
      </p>
    </div>
  );
}
