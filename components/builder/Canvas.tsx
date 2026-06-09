"use client";

import { useEffect, useRef, useCallback } from "react";
import { useBuilderStore } from "@/store/builder";
import { buildSandboxDoc } from "@/lib/sandbox";
import { SelectedArea } from "@/types";

const VIEWPORT_WIDTHS = { desktop: "100%", tablet: "768px", mobile: "390px" };

export default function Canvas() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { html, isGenerating, viewportSize, setSelectedArea } = useBuilderStore();

  const handleMessage = useCallback(
    (e: MessageEvent) => {
      if (e.data?.type !== "ELEMENT_SELECTED") return;
      setSelectedArea(e.data.payload as SelectedArea);
    },
    [setSelectedArea]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  // Only render into the iframe when generation is NOT in progress.
  // Updating srcdoc on every streaming chunk cancels in-flight CDN script
  // requests (GSAP, Three.js), causing ERR_TIMED_OUT and a blank canvas.
  useEffect(() => {
    if (isGenerating) return;
    if (!iframeRef.current) return;
    iframeRef.current.srcdoc = html ? buildSandboxDoc(html) : getPlaceholderDoc();
  }, [html, isGenerating]);

  const iframeWidth = VIEWPORT_WIDTHS[viewportSize];
  const isConstrained = viewportSize !== "desktop";

  return (
    <div className="relative w-full h-full bg-[#050505] flex items-start justify-center overflow-auto">
      {/* Viewport frame */}
      <div
        className="relative h-full transition-all duration-300 ease-in-out flex-shrink-0"
        style={{ width: iframeWidth }}
      >
        {/* Device label */}
        {isConstrained && (
          <div className="absolute -top-6 left-0 right-0 flex justify-center pointer-events-none">
            <span className="text-xs text-text-muted font-mono">{iframeWidth}</span>
          </div>
        )}

        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          style={isConstrained ? { boxShadow: "0 0 0 1px #2a2a2a" } : {}}
          sandbox="allow-scripts"
          title="Canvas"
        />

        {/* Generating overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 pointer-events-none">
            <div className="flex gap-1.5 items-end h-8">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-accent"
                  style={{
                    height: `${10 + Math.abs(Math.sin(i * 0.8)) * 20}px`,
                    animation: "pulse 1s ease-in-out infinite",
                    animationDelay: `${i * 130}ms`,
                  }}
                />
              ))}
            </div>
            <p className="text-sm text-text-muted font-light tracking-wide">Claude está generando...</p>
          </div>
        )}

        {/* Empty state */}
        {!html && !isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-surface-2 border border-border flex items-center justify-center">
                <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-text-muted text-sm">Tu canvas aparecerá aquí</p>
              <p className="text-text-muted text-xs opacity-50">Escribí un prompt o elegí un template</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getPlaceholderDoc(): string {
  return `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;}body{background:#0a0a0a;width:100%;height:100vh;}</style></head><body></body></html>`;
}
