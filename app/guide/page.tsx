"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { GUIDE_CATEGORIES, searchTerms } from "@/lib/guide";

export default function GuidePage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(GUIDE_CATEGORIES[0].id);

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    return searchTerms(query.trim());
  }, [query]);

  const activeCategory_ = GUIDE_CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <main className="min-h-screen bg-surface overflow-auto">
      {/* Grid background */}
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#7c3aed 1px, transparent 1px), linear-gradient(90deg, #7c3aed 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/" className="text-sm font-semibold text-text hover:text-accent transition-colors">
                Web<span className="text-accent">Craft</span>
              </Link>
              <span className="text-border text-sm">›</span>
              <span className="text-sm text-text-muted">Guía de Prompts</span>
            </div>
            <h1 className="text-2xl font-semibold text-text">
              Vocabulario para prompts
            </h1>
            <p className="text-text-muted text-sm mt-1">
              Términos técnicos y estratégicos para obtener mejores resultados de la IA.
            </p>
          </div>
          <Link
            href="/"
            className="text-xs text-text-muted hover:text-text transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Dashboard
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
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
            placeholder="Buscar término, descripción o ejemplo..."
            className="w-full bg-surface-1 border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-text placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Search results */}
        {searchResults !== null ? (
          <div>
            <p className="text-xs text-text-muted mb-4">
              {searchResults.length === 0
                ? "Sin resultados"
                : `${searchResults.length} resultado${searchResults.length !== 1 ? "s" : ""}`}
            </p>
            <div className="space-y-3">
              {searchResults.map((result) => (
                <TermCard key={result.term} term={result} showCategory />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Category sidebar */}
            <div className="w-44 flex-shrink-0 space-y-1">
              {GUIDE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                    activeCategory === cat.id
                      ? "bg-accent/15 text-accent border border-accent/30"
                      : "text-text-muted hover:text-text hover:bg-surface-1"
                  }`}
                >
                  <span className="text-base leading-none">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Terms */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">{activeCategory_.icon}</span>
                <h2 className="text-lg font-semibold text-text">{activeCategory_.name}</h2>
                <span className="text-xs text-text-muted ml-1">
                  {activeCategory_.terms.length} términos
                </span>
              </div>
              <div className="space-y-3">
                {activeCategory_.terms.map((term) => (
                  <TermCard key={term.term} term={term} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function TermCard({
  term,
  showCategory = false,
}: {
  term: { term: string; desc: string; example: string; category?: string };
  showCategory?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(term.example);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-2xl bg-surface-1 border border-border p-4 space-y-3 hover:border-accent/40 transition-colors group">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-sm font-mono font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-md">
              {term.term}
            </code>
            {showCategory && term.category && (
              <span className="text-xs text-text-muted bg-surface-2 px-2 py-0.5 rounded-full border border-border">
                {term.category}
              </span>
            )}
          </div>
          <p className="text-sm text-text-muted mt-1.5 leading-relaxed">{term.desc}</p>
        </div>
      </div>

      {/* Example prompt */}
      <div className="bg-surface-2 rounded-xl p-3 border border-border">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
            Ejemplo de prompt
          </span>
          <button
            onClick={handleCopy}
            className="text-[10px] text-text-muted hover:text-accent transition-colors flex items-center gap-1"
          >
            {copied ? (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copiado
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copiar
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-text leading-relaxed italic">"{term.example}"</p>
      </div>
    </div>
  );
}
