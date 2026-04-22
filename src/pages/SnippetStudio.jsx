import React, { useState, useMemo, useRef } from "react";
import {
  ArrowLeft, Save, Download, Upload, Trash2, Plus, Copy, Check, AlertCircle,
  FileCode, Box, Eye, Code2, Sparkles, Monitor, Smartphone,
} from "lucide-react";

import { DEFAULT_LOBS } from "../lobs/defaults.jsx";
import { compileCustomSnippet, serializeCustomSnippet, parseCustomSnippet } from "../snippets/customLoader.jsx";
import { persist } from "../lib/storage.jsx";
import { newId, clone } from "../lib/tokens.jsx";
import { Toast } from "../components/UI.jsx";

const FIELD_TYPES = ["text", "textarea", "url", "color", "number", "image", "select"];

const STARTER = {
  id: "my_snippet",
  label: "My Custom Snippet",
  category: "Custom",
  fields: [
    { key: "headline", label: "Headline", type: "text", default: "Your headline here" },
    { key: "body", label: "Body", type: "textarea", default: "Your body copy goes here.", rows: 3 },
  ],
  htmlTemplate: `<tr>
  <td align="center" style="padding:24px;">
    <h1 style="color:{{headlineColor|h1Color}};font-family:{{|fontStack}};margin:0;">
      {{headline}}
    </h1>
    <p style="color:{{bodyColor|bodyColor}};margin:12px 0 0 0;">
      {{body}}
    </p>
  </td>
</tr>`,
};

export default function SnippetStudio({ customSnippets, setCustomSnippets, onNavigateBack }) {
  const [selectedId, setSelectedId] = useState(customSnippets[0]?.id || null);
  const [draft, setDraft] = useState(() => {
    if (customSnippets[0]) return clone(customSnippets[0]);
    return clone(STARTER);
  });
  const [isDirty, setIsDirty] = useState(false);
  const [previewLobId, setPreviewLobId] = useState("mbs");
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [toast, setToast] = useState(null);
  const [activeView, setActiveView] = useState("split"); // split | html | preview
  const fileInputRef = useRef(null);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const update = (patch) => {
    setDraft((prev) => ({ ...prev, ...patch }));
    setIsDirty(true);
  };

  // Select an existing snippet (loads it as the draft)
  const selectSnippet = (id) => {
    if (isDirty && !confirm("Discard unsaved changes?")) return;
    const s = customSnippets.find((x) => x.id === id);
    if (s) {
      setDraft(clone(s));
      setSelectedId(id);
      setIsDirty(false);
    }
  };

  const newSnippet = () => {
    if (isDirty && !confirm("Discard unsaved changes?")) return;
    const fresh = { ...clone(STARTER), id: `snippet_${Date.now()}` };
    setDraft(fresh);
    setSelectedId(null);
    setIsDirty(true);
  };

  const saveLocal = () => {
    if (!draft.id || !draft.label) {
      flash("Snippet needs an id and label");
      return;
    }
    // Validate the compile first
    try {
      compileCustomSnippet(draft);
    } catch (err) {
      flash(`Invalid: ${err.message}`);
      return;
    }
    const exists = customSnippets.some((s) => s.id === draft.id);
    const next = exists
      ? customSnippets.map((s) => (s.id === draft.id ? clone(draft) : s))
      : [...customSnippets, clone(draft)];
    setCustomSnippets(next);
    persist.saveCustomSnippets(next);
    setSelectedId(draft.id);
    setIsDirty(false);
    flash(exists ? `Updated ${draft.label}` : `Created ${draft.label}`);
  };

  const deleteSnippet = () => {
    if (!selectedId) return;
    if (!confirm(`Delete "${draft.label}"?`)) return;
    const next = customSnippets.filter((s) => s.id !== selectedId);
    setCustomSnippets(next);
    persist.saveCustomSnippets(next);
    if (next.length > 0) {
      setDraft(clone(next[0]));
      setSelectedId(next[0].id);
    } else {
      setDraft(clone(STARTER));
      setSelectedId(null);
    }
    setIsDirty(false);
    flash("Deleted");
  };

  const exportJson = () => {
    const json = serializeCustomSnippet(draft);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${draft.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    flash("Downloaded JSON — commit to src/snippets/custom/");
  };

  const importJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => {
      try {
        const parsed = parseCustomSnippet(ev.target.result);
        setDraft(parsed);
        setSelectedId(null);
        setIsDirty(true);
        flash(`Imported "${parsed.label}"`);
      } catch (err) {
        flash(`Import failed: ${err.message}`);
      }
    };
    r.readAsText(file);
    e.target.value = "";
  };

  // ---- Field editor ----
  const updateField = (idx, patch) => {
    const next = [...draft.fields];
    next[idx] = { ...next[idx], ...patch };
    update({ fields: next });
  };
  const addField = () => {
    update({
      fields: [...(draft.fields || []), { key: `field_${draft.fields.length + 1}`, label: "New field", type: "text", default: "" }],
    });
  };
  const removeField = (idx) => update({ fields: draft.fields.filter((_, i) => i !== idx) });
  const moveField = (idx, dir) => {
    const next = [...draft.fields];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    update({ fields: next });
  };

  // ---- Compile + preview ----
  const compiled = useMemo(() => {
    try {
      return { snippet: compileCustomSnippet(draft), error: null };
    } catch (err) {
      return { snippet: null, error: err.message };
    }
  }, [draft]);

  const previewBlock = useMemo(() => {
    if (!compiled.snippet) return {};
    return compiled.snippet.defaults();
  }, [compiled]);

  const previewTokens = DEFAULT_LOBS[previewLobId].tokens;

  return (
    <div
      className="w-full h-screen flex flex-col overflow-hidden relative"
      style={{
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        background: "radial-gradient(ellipse at top left, #1e293b 0%, #0f172a 40%, #020617 100%)",
      }}
    >
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
        />
      </div>

      {/* Top bar */}
      <header
        className="relative z-20 h-14 flex items-center justify-between px-4 shrink-0 border-b"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
          backdropFilter: "blur(20px) saturate(180%)",
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateBack}
            className="p-1.5 rounded-lg text-white/60 hover:text-white"
            style={{ background: "rgba(255,255,255,0.04)" }}
            title="Back to Builder"
          >
            <ArrowLeft size={14} />
          </button>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
              boxShadow: "0 4px 16px rgba(139,92,246,0.4)",
            }}
          >
            <Code2 size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white leading-none">Snippet Studio</h1>
            <p className="text-[10px] text-white/50 leading-none mt-0.5">Author custom snippets · HTML + JSON schema</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex rounded-lg p-0.5" style={{ background: "rgba(255,255,255,0.06)" }}>
            {[
              { id: "split", label: "Split", icon: Code2 },
              { id: "html", label: "HTML", icon: FileCode },
              { id: "preview", label: "Preview", icon: Eye },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveView(v.id)}
                className={`flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-md transition-all ${
                  activeView === v.id ? "bg-white/15 text-white" : "text-white/50 hover:text-white/80"
                }`}
              >
                <v.icon size={11} /> {v.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white rounded-lg"
            style={{ background: "rgba(255,255,255,0.06)" }}
            title="Import JSON"
          >
            <Upload size={13} /> Import
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" onChange={importJson} className="hidden" />
          <button
            onClick={exportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white rounded-lg"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <Download size={13} /> Export JSON
          </button>
          <button
            onClick={saveLocal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg hover:scale-[1.02] shadow-lg"
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              boxShadow: "0 4px 16px rgba(16,185,129,0.4)",
            }}
          >
            <Save size={13} /> Save {isDirty && <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-white/80 inline-block" />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Sidebar: list of custom snippets */}
        <aside
          className="w-64 flex flex-col shrink-0 border-r"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
            backdropFilter: "blur(24px)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <div className="p-3 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <button
              onClick={newSnippet}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-white/90 rounded-lg hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.2))",
                border: "1px dashed rgba(255,255,255,0.2)",
              }}
            >
              <Plus size={12} /> New snippet
            </button>
          </div>
          <div className="flex-1 overflow-auto p-2">
            <p className="text-[10px] font-semibold text-white/60 px-1 mb-2 uppercase tracking-wider">
              Custom snippets ({customSnippets.length})
            </p>
            {customSnippets.length === 0 ? (
              <p className="text-[11px] text-white/40 px-2 py-4 text-center leading-relaxed">
                No custom snippets yet. Click <strong>New snippet</strong> above to get started.
              </p>
            ) : (
              customSnippets.map((s) => (
                <button
                  key={s.id}
                  onClick={() => selectSnippet(s.id)}
                  className={`w-full text-left flex items-center gap-2 p-2 rounded-lg mb-1 transition-all ${
                    selectedId === s.id ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
                  }`}
                >
                  <Box size={12} className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{s.label}</p>
                    <p className="text-[10px] text-white/40 font-mono truncate">{s.id}</p>
                  </div>
                </button>
              ))
            )}
          </div>
          <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <button
              onClick={deleteSnippet}
              disabled={!selectedId}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] text-red-300/80 hover:text-red-200 rounded-lg disabled:opacity-30"
              style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)" }}
            >
              <Trash2 size={11} /> Delete
            </button>
          </div>
        </aside>

        {/* Metadata + fields column */}
        {(activeView === "split" || activeView === "html") && (
          <div className="w-[380px] overflow-auto p-4 shrink-0 border-r" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <h2 className="text-[10px] font-semibold text-white/60 uppercase tracking-wider mb-3">Metadata</h2>
            <Field label="ID (unique, snake_case)" value={draft.id} onChange={(v) => update({ id: v })} mono />
            <Field label="Label (shown to users)" value={draft.label} onChange={(v) => update({ label: v })} />
            <Field label="Category" value={draft.category} onChange={(v) => update({ category: v })} />

            <div className="flex items-center justify-between mt-4 mb-2">
              <h2 className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Fields</h2>
              <button
                onClick={addField}
                className="flex items-center gap-1 px-2 py-1 text-[10px] text-white/70 hover:text-white rounded-lg"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <Plus size={10} /> Add
              </button>
            </div>

            {(draft.fields || []).map((f, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg mb-2"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <code className="text-[10px] text-white/50">#{i + 1}</code>
                  <div className="flex gap-0.5">
                    <button onClick={() => moveField(i, -1)} className="p-0.5 text-white/40 hover:text-white/80" title="Move up">
                      ↑
                    </button>
                    <button onClick={() => moveField(i, 1)} className="p-0.5 text-white/40 hover:text-white/80" title="Move down">
                      ↓
                    </button>
                    <button onClick={() => removeField(i)} className="p-0.5 text-red-300 hover:text-red-200">
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Key" value={f.key} onChange={(v) => updateField(i, { key: v })} mono small />
                  <Field label="Label" value={f.label} onChange={(v) => updateField(i, { label: v })} small />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="text-[9px] text-white/50 mb-1 block uppercase">Type</label>
                    <select
                      value={f.type}
                      onChange={(e) => updateField(i, { type: e.target.value })}
                      className="w-full px-2 py-1 text-[11px] rounded text-white/90"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      {FIELD_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Field label="Default" value={f.default} onChange={(v) => updateField(i, { default: v })} small />
                </div>
                {f.type === "select" && (
                  <Field
                    label="Options (comma-separated)"
                    value={(f.options || []).join(", ")}
                    onChange={(v) => updateField(i, { options: v.split(",").map((s) => s.trim()).filter(Boolean) })}
                    small
                  />
                )}
              </div>
            ))}

            <div className="mt-6 p-3 rounded-lg text-[10px] text-blue-100/80 leading-relaxed" style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}>
              <p className="font-semibold mb-1 flex items-center gap-1.5">
                <Sparkles size={10} /> HTML template syntax
              </p>
              <code className="block mb-1 text-white/80">{"{{fieldKey}}"}</code>
              <span>— inserts the field value (auto-escaped)</span>
              <code className="block mt-2 mb-1 text-white/80">{"{{|tokenKey}}"}</code>
              <span>— inserts a LOB token (e.g. fontStack)</span>
              <code className="block mt-2 mb-1 text-white/80">{"{{override|tokenKey}}"}</code>
              <span>— uses override if set, else falls back to LOB token</span>
            </div>
          </div>
        )}

        {/* HTML editor + preview */}
        <main className="flex-1 flex overflow-hidden">
          {(activeView === "split" || activeView === "html") && (
            <div className="flex-1 flex flex-col overflow-hidden border-r" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <div
                className="h-10 flex items-center justify-between px-3 border-b"
                style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
              >
                <div className="flex items-center gap-2">
                  <FileCode size={12} className="text-white/60" />
                  <span className="text-[11px] font-medium text-white/80">HTML template</span>
                </div>
                <span className="text-[10px] text-white/40 font-mono">{draft.htmlTemplate?.length || 0} chars</span>
              </div>
              <textarea
                value={draft.htmlTemplate}
                onChange={(e) => update({ htmlTemplate: e.target.value })}
                spellCheck={false}
                className="flex-1 p-4 text-[11px] font-mono text-white/90 bg-black/30 resize-none focus:outline-none"
                style={{ tabSize: 2 }}
              />
            </div>
          )}

          {(activeView === "split" || activeView === "preview") && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div
                className="h-10 flex items-center justify-between px-3 border-b"
                style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
              >
                <div className="flex items-center gap-2">
                  <Eye size={12} className="text-white/60" />
                  <span className="text-[11px] font-medium text-white/80">Live preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-md p-0.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <button
                      onClick={() => setPreviewDevice("desktop")}
                      className={`p-1 rounded transition-all ${previewDevice === "desktop" ? "bg-white/15 text-white" : "text-white/50 hover:text-white/80"}`}
                      title="Desktop preview"
                    >
                      <Monitor size={11} />
                    </button>
                    <button
                      onClick={() => setPreviewDevice("mobile")}
                      className={`p-1 rounded transition-all ${previewDevice === "mobile" ? "bg-white/15 text-white" : "text-white/50 hover:text-white/80"}`}
                      title="Mobile preview"
                    >
                      <Smartphone size={11} />
                    </button>
                  </div>
                  <select
                    value={previewLobId}
                    onChange={(e) => setPreviewLobId(e.target.value)}
                    className="px-2 py-0.5 text-[10px] rounded text-white/80"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    {Object.values(DEFAULT_LOBS).map((lob) => (
                      <option key={lob.id} value={lob.id}>
                        {lob.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-6" style={{ backgroundColor: previewTokens.outerBg }}>
                {compiled.error ? (
                  <div
                    className="p-4 rounded-lg text-xs text-red-200"
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle size={14} />
                      <span className="font-semibold">Compile error</span>
                    </div>
                    <code className="block text-[11px] font-mono">{compiled.error}</code>
                  </div>
                ) : compiled.snippet ? (
                  <div
                    className="rounded-lg overflow-hidden shadow-xl mx-auto transition-all duration-300"
                    style={{ backgroundColor: previewTokens.canvasBg, maxWidth: previewDevice === "mobile" ? 380 : 648 }}
                  >
                    <compiled.snippet.Preview b={previewBlock} t={previewTokens} device={previewDevice} />
                  </div>
                ) : null}

                <div
                  className="mt-6 p-3 rounded-lg text-[10px] text-white/60 max-w-[648px] mx-auto"
                  style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <p className="font-semibold text-white/80 mb-1">Rendered HTML:</p>
                  <pre className="whitespace-pre-wrap font-mono text-[10px] max-h-40 overflow-auto">
                    {compiled.snippet ? compiled.snippet.toHTML(previewBlock, previewTokens) : ""}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Toast message={toast} />
    </div>
  );
}

function Field({ label, value, onChange, mono = false, small = false }) {
  return (
    <div className={small ? "mb-1.5" : "mb-3"}>
      <label className={`${small ? "text-[9px]" : "text-[10px]"} font-medium text-white/50 mb-1 block uppercase tracking-wider`}>
        {label}
      </label>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-2 ${small ? "py-1 text-[11px]" : "py-1.5 text-xs"} rounded-lg text-white/90 focus:outline-none ${mono ? "font-mono" : ""}`}
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
      />
    </div>
  );
}
