"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { GUIDE_CATEGORIES, searchTerms } from "@/lib/guide";

interface GuideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (text: string) => void;
}

export default function GuideDrawer({ isOpen, onClose, onInsert }: GuideDrawerProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(GUIDE_CATEGORIES[0].id);

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    return searchTerms(query.trim());
  }, [query]);

  const activeTerms =
    searchResults ?? GUIDE_CATEGORIES.find((c) => c.id === activeCategory)?.terms ?? [];

  if (!isOpen) return null;

  return (
    <div className="border-t border-border bg-surface-1 flex flex-col" style={{ height: "280px" }}>
      {/* Drawer header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border flex-shrink-0">
        <span className="text-xs font-medium text-text">Vocabulario</span>
        <div className="flex items-center gap-2">
          <Link
            href="/guide"
            target="_blank"
            className="text-[10px] text-text-muted hover:text-accent transition-colors flex items-center gap-1"
          >
            Ver guía completa
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
          <button
            onClick={onClose}
            className="w-5 h-5 flex items-center justify-center text-text-muted hover:text-text transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2 flex-shrink-0">
        <div className="relative">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar término..."
            className="w-full bg-surface-2 border border-border rounded-lg pl-7 pr-3 py-1.5 text-xs text-text placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category tabs (only when not searching) */}
      {!query.trim() && (
        <div className="flex border-b border-border overflow-x-auto flex-shrink-0 scrollbar-none px-1">
          {GUIDE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium transition-colors ${
                activeCategory === cat.id
                  ? "text-accent border-b-2 border-accent"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Terms list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {searchResults !== null && searchResults.length === 0 && (
          <p className="text-xs text-text-muted text-center pt-4">Sin resultados</p>
        )}
        {activeTerms.map((term) => (
          <button
            key={term.term}
            onClick={() => onInsert(term.term)}
            className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-surface-2 border border-transparent hover:border-border transition-all group"
          >
            <div className="flex items-center justify-between gap-2">
              <code className="text-[11px] font-mono font-semibold text-accent">{term.term}</code>
              <span className="text-[10px] text-text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                insertar ↵
              </span>
            </div>
            <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed line-clamp-1">
              {term.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
