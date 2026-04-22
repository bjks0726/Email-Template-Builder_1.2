import React, { useState } from "react";
import { Copy, Download, FileCode, Keyboard, Sparkles, Palette, Sliders, RotateCcw } from "lucide-react";
import { ModalShell } from "./UI.jsx";

export function ExportModal({ html, onClose, flash }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    flash && flash("HTML copied");
  };
  const download = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email-template.html";
    a.click();
    URL.revokeObjectURL(url);
    flash && flash("Downloaded");
  };
  return (
    <ModalShell onClose={onClose} title="Export HTML" subtitle="Outlook-safe · Mobile-responsive · ESP-ready" icon={FileCode} wide>
      <pre
        className="text-[11px] p-4 rounded-lg overflow-auto text-white/80 leading-relaxed font-mono whitespace-pre-wrap max-h-[50vh]"
        style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {html}
      </pre>
      <div className="flex items-center justify-end gap-2 mt-4">
        <button
          onClick={copy}
          className="px-4 py-2 text-xs font-medium text-white/80 hover:text-white rounded-lg flex items-center gap-1.5"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Copy size={13} /> {copied ? "Copied!" : "Copy HTML"}
        </button>
        <button
          onClick={download}
          className="px-4 py-2 text-xs font-semibold text-white rounded-lg flex items-center gap-1.5 hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", boxShadow: "0 4px 16px rgba(59,130,246,0.4)" }}
        >
          <Download size={13} /> Download
        </button>
      </div>
    </ModalShell>
  );
}

export function ShortcutsModal({ onClose }) {
  const items = [
    { keys: ["⌘", "Z"], label: "Undo" },
    { keys: ["⌘", "⇧", "Z"], label: "Redo" },
    { keys: ["⌘", "S"], label: "Save template" },
    { keys: ["⌘", "E"], label: "Export" },
    { keys: ["⌘", "D"], label: "Duplicate selected" },
    { keys: ["⌫"], label: "Delete selected" },
    { keys: ["Esc"], label: "Deselect / close modal" },
    { keys: ["⌘", "/"], label: "Show shortcuts" },
  ];
  return (
    <ModalShell onClose={onClose} title="Keyboard shortcuts" icon={Keyboard}>
      <div className="space-y-2">
        {items.map((s, i) => (
          <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
            <span className="text-xs text-white/80">{s.label}</span>
            <div className="flex gap-1">
              {s.keys.map((k, j) => (
                <kbd
                  key={j}
                  className="px-2 py-0.5 text-[10px] font-mono font-semibold text-white/90 rounded"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  {k}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ModalShell>
  );
}

export function TourOverlay({ onClose }) {
  const [step, setStep] = useState(0);
  const S = [
    { title: "Welcome to Email Studio", body: "Build branded email templates with drag-and-drop snippets and a full design token system.", icon: Sparkles },
    { title: "LOB switcher", body: "Click the colored pill in the top bar to switch Line of Business or create a new one. All typography, colors, and CTAs retheme instantly.", icon: Palette },
    { title: "Basic vs Advanced edit mode", body: "When you click a block, switch between Basic (content only) and Advanced (full size/color/radius/padding overrides). Mid-dev precision.", icon: Sliders },
    { title: "Token-aware overrides", body: "Advanced mode tags each prop with 'from LOB'. Override it per-block — then reset back to the LOB default with one click.", icon: RotateCcw },
    { title: "Snippet Studio", body: "Switch to the Snippet Studio (top bar) to author custom snippets from raw HTML + a JSON field schema. Save them locally or export JSON to commit to GitHub.", icon: FileCode },
  ];
  const s = S[step];
  const Icon = s.icon;
  return (
    <ModalShell onClose={onClose} title={s.title} icon={Icon}>
      <p className="text-sm text-white/80 leading-relaxed">{s.body}</p>
      <div className="flex items-center gap-1.5 mt-6 mb-4">
        {S.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all ${i === step ? "w-8 bg-white" : i < step ? "w-4 bg-white/50" : "w-4 bg-white/20"}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <button onClick={() => (step > 0 ? setStep(step - 1) : onClose())} className="text-xs text-white/60 hover:text-white">
          {step === 0 ? "Skip" : "Back"}
        </button>
        {step === S.length - 1 ? (
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white rounded-lg"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
          >
            Start building
          </button>
        ) : (
          <button
            onClick={() => setStep(step + 1)}
            className="px-4 py-2 text-xs font-semibold text-white rounded-lg"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
          >
            Next
          </button>
        )}
      </div>
    </ModalShell>
  );
}
