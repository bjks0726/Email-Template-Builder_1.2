import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Monitor, Smartphone, Download, Save, Trash2, Copy, Sparkles, Layers,
  FolderOpen, FileCode, ChevronRight, Undo2, Redo2, Keyboard, ChevronDown,
  Wand2, Search, HelpCircle, Settings2,
} from "lucide-react";

import { DEFAULT_LOBS } from "../lobs/defaults.jsx";
import { BUILTIN_SNIPPETS } from "../snippets/builtin.jsx";
import { compileCustomSnippets } from "../snippets/customLoader.jsx";
import { TEMPLATES } from "../snippets/templates.jsx";
import { buildShell } from "../lib/shell.jsx";
import { newId, clone } from "../lib/tokens.jsx";
import { persist } from "../lib/storage.jsx";

import { GlassIconButton, DropZone, GlassField, Toast } from "../components/UI.jsx";
import { LobModal, LobEditor } from "../components/LobModals.jsx";
import { ExportModal, TourOverlay, ShortcutsModal } from "../components/Modals.jsx";
import { PropsPanel, EmptyProps } from "../components/PropsPanel.jsx";

export default function Builder({ customSnippets, onNavigateToStudio }) {
  // ---- Persistent LOBs (default + user-created) ----
  const [lobs, setLobs] = useState(() => {
    const saved = persist.loadLobs();
    return saved || DEFAULT_LOBS;
  });
  useEffect(() => { persist.saveLobs(lobs); }, [lobs]);

  // ---- Session (blocks + active LOB) ----
  const savedSession = persist.loadLastSession();
  const [lobId, setLobId] = useState(savedSession?.lobId || "mbs");
  const [tokens, setTokens] = useState(lobs[lobId]?.tokens || DEFAULT_LOBS.mbs.tokens);
  const [blocks, setBlocks] = useState(() => {
    if (savedSession?.blocks?.length) return savedSession.blocks;
    return TEMPLATES.matchday.blocks.map((b) => ({ ...b, id: newId(), data: clone(b.data) }));
  });
  const [settings, setSettings] = useState(savedSession?.settings || { title: "Email", preheader: "Your preheader text here" });

  useEffect(() => {
    persist.saveLastSession({ lobId, blocks, settings });
  }, [lobId, blocks, settings]);

  // Templates (user-saved)
  const [savedTemplates, setSavedTemplates] = useState(() => persist.loadTemplates());
  useEffect(() => { persist.saveTemplates(savedTemplates); }, [savedTemplates]);

  // ---- UI state ----
  const [selectedId, setSelectedId] = useState(null);
  const [device, setDevice] = useState("desktop");
  const [activeTab, setActiveTab] = useState("snippets");
  const [showExport, setShowExport] = useState(false);
  const [showLobModal, setShowLobModal] = useState(false);
  const [showLobEditor, setShowLobEditor] = useState(null);
  const [showTour, setShowTour] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [dragOver, setDragOver] = useState(null);
  const [snippetSearch, setSnippetSearch] = useState("");
  const [propsMode, setPropsMode] = useState("basic");
  const [toast, setToast] = useState(null);

  const historyRef = useRef({ past: [], future: [] });
  const fileInputRef = useRef(null);
  const uploadTargetRef = useRef(null);

  // ---- Unified registry: built-in + custom ----
  const registry = useMemo(() => {
    const custom = compileCustomSnippets(customSnippets);
    return { ...BUILTIN_SNIPPETS, ...custom };
  }, [customSnippets]);

  const selected = blocks.find((b) => b.id === selectedId);
  const activeLob = lobs[lobId];

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  // ---- History ----
  const snapshot = () => {
    historyRef.current.past.push({ blocks: clone(blocks), tokens: { ...tokens }, lobId });
    if (historyRef.current.past.length > 50) historyRef.current.past.shift();
    historyRef.current.future = [];
  };
  const undo = () => {
    const p = historyRef.current.past.pop();
    if (!p) return;
    historyRef.current.future.push({ blocks: clone(blocks), tokens: { ...tokens }, lobId });
    setBlocks(p.blocks);
    setTokens(p.tokens);
    setLobId(p.lobId);
    flash("Undo");
  };
  const redo = () => {
    const n = historyRef.current.future.pop();
    if (!n) return;
    historyRef.current.past.push({ blocks: clone(blocks), tokens: { ...tokens }, lobId });
    setBlocks(n.blocks);
    setTokens(n.tokens);
    setLobId(n.lobId);
    flash("Redo");
  };

  // ---- Block ops ----
  const addBlock = (key, index = blocks.length) => {
    const s = registry[key];
    if (!s) return;
    snapshot();
    const nb = { id: newId(), snippet: key, data: s.defaults() };
    const next = [...blocks];
    next.splice(index, 0, nb);
    setBlocks(next);
    setSelectedId(nb.id);
    setActiveTab("properties");
    flash(`Added ${s.label}`);
  };
  const updateData = (id, patch) => {
    snapshot();
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, data: { ...b.data, ...patch } } : b)));
  };
  const updateNested = (id, path, val) => {
    snapshot();
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const data = clone(b.data);
        const keys = path.split(".");
        let obj = data;
        for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
        obj[keys[keys.length - 1]] = val;
        return { ...b, data };
      }),
    );
  };
  const resetOverride = (id, key) => {
    snapshot();
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const data = { ...b.data };
        delete data[key];
        return { ...b, data };
      }),
    );
  };
  const deleteBlock = (id) => {
    snapshot();
    setBlocks((p) => p.filter((b) => b.id !== id));
    if (selectedId === id) setSelectedId(null);
    flash("Deleted");
  };
  const duplicateBlock = (id) => {
    const i = blocks.findIndex((b) => b.id === id);
    if (i < 0) return;
    snapshot();
    const copy = { ...blocks[i], id: newId(), data: clone(blocks[i].data) };
    const next = [...blocks];
    next.splice(i + 1, 0, copy);
    setBlocks(next);
    flash("Duplicated");
  };

  // ---- LOB ops ----
  const switchLob = (id) => {
    if (id === lobId) {
      setShowLobModal(false);
      return;
    }
    snapshot();
    setLobId(id);
    setTokens(lobs[id].tokens);
    setShowLobModal(false);
    flash(`Rethemed to ${lobs[id].name}`);
  };
  const saveLob = (lob) => {
    setLobs((prev) => ({ ...prev, [lob.id]: lob }));
    if (lob.id === lobId) setTokens(lob.tokens);
    setShowLobEditor(null);
    flash(`Saved ${lob.name}`);
  };
  const deleteLob = (id) => {
    if (Object.keys(lobs).length <= 1) return flash("Can't delete the last LOB");
    const next = { ...lobs };
    delete next[id];
    setLobs(next);
    if (lobId === id) {
      const first = Object.keys(next)[0];
      setLobId(first);
      setTokens(next[first].tokens);
    }
    setShowLobEditor(null);
    flash("Deleted LOB");
  };

  // ---- Drag and drop ----
  const onPaletteDragStart = (e, k) => {
    e.dataTransfer.setData("snippet", k);
    e.dataTransfer.effectAllowed = "copy";
  };
  const onCanvasDragOver = (e, i) => {
    e.preventDefault();
    setDragOver(i);
  };
  const onCanvasDrop = (e, i) => {
    e.preventDefault();
    const k = e.dataTransfer.getData("snippet");
    const rid = e.dataTransfer.getData("reorder-id");
    if (k && registry[k]) addBlock(k, i);
    else if (rid) {
      const f = blocks.findIndex((b) => b.id === rid);
      if (f >= 0 && f !== i) {
        snapshot();
        const next = [...blocks];
        const [m] = next.splice(f, 1);
        next.splice(f < i ? i - 1 : i, 0, m);
        setBlocks(next);
      }
    }
    setDragOver(null);
  };
  const onBlockDragStart = (e, id) => {
    e.dataTransfer.setData("reorder-id", id);
    e.dataTransfer.effectAllowed = "move";
  };

  // ---- Image upload ----
  const triggerUpload = (blockId, field) => {
    uploadTargetRef.current = { blockId, field };
    fileInputRef.current?.click();
  };
  const onFile = (e) => {
    const f = e.target.files?.[0];
    const tg = uploadTargetRef.current;
    if (!f || !tg) return;
    const r = new FileReader();
    r.onload = (ev) => {
      if (tg.field.includes(".")) updateNested(tg.blockId, tg.field, ev.target.result);
      else updateData(tg.blockId, { [tg.field]: ev.target.result });
      flash("Image uploaded");
    };
    r.readAsDataURL(f);
    e.target.value = "";
  };

  // ---- Templates ----
  const loadTemplate = (k) => {
    snapshot();
    setBlocks(TEMPLATES[k].blocks.map((b) => ({ ...b, id: newId(), data: clone(b.data) })));
    setSelectedId(null);
    flash(`Loaded ${TEMPLATES[k].name}`);
  };
  const saveCurrent = () => {
    const n = prompt("Template name:");
    if (!n) return;
    setSavedTemplates((p) => [...p, { name: n, blocks: clone(blocks), lobId, at: Date.now() }]);
    flash(`Saved "${n}"`);
  };

  // ---- Keyboard shortcuts ----
  useEffect(() => {
    const on = (e) => {
      const m = e.metaKey || e.ctrlKey;
      if (m && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (m && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      } else if (m && e.key === "s") {
        e.preventDefault();
        saveCurrent();
      } else if (m && e.key === "e") {
        e.preventDefault();
        setShowExport(true);
      } else if (m && e.key === "/") {
        e.preventDefault();
        setShowShortcuts(true);
      } else if (e.key === "Escape") {
        setSelectedId(null);
        setShowExport(false);
        setShowLobModal(false);
        setShowLobEditor(null);
        setShowShortcuts(false);
        setShowTour(false);
      } else if (
        e.key === "Delete" &&
        selected &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)
      ) {
        e.preventDefault();
        deleteBlock(selected.id);
      } else if (m && e.key === "d" && selected) {
        e.preventDefault();
        duplicateBlock(selected.id);
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks, selected, tokens, lobId]);

  const grouped = Object.values(registry).reduce((acc, s) => {
    if (snippetSearch && !s.label.toLowerCase().includes(snippetSearch.toLowerCase())) return acc;
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  const canvasW = device === "mobile" ? 380 : 696;

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
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
          style={{ background: `radial-gradient(circle, ${tokens.accent} 0%, transparent 70%)` }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl"
          style={{ background: `radial-gradient(circle, #3b82f6 0%, transparent 70%)` }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{ background: `radial-gradient(circle, #8b5cf6 0%, transparent 70%)` }}
        />
      </div>

      {/* Top bar */}
      <header
        className="relative z-20 h-14 flex items-center justify-between px-4 shrink-0 border-b"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${tokens.accent} 0%, ${tokens.accent}dd 100%)`,
              boxShadow: `0 4px 16px ${tokens.accent}60`,
            }}
          >
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white leading-none">Email Studio</h1>
            <p className="text-[10px] text-white/50 leading-none mt-0.5">Builder</p>
          </div>
          <button
            onClick={onNavigateToStudio}
            className="ml-3 px-3 py-1 text-[11px] font-medium rounded-lg text-white/70 hover:text-white transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Snippet Studio →
          </button>
        </div>

        <button
          onClick={() => setShowLobModal(true)}
          className="group flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all hover:scale-[1.02]"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div className="flex gap-0.5">
            {activeLob.swatch.map((c, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm"
                style={{ background: c, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)" }}
              />
            ))}
          </div>
          <div className="text-left">
            <div className="text-[11px] font-semibold text-white leading-none">{activeLob.name}</div>
            <div className="text-[9px] text-white/50 leading-none mt-0.5">{activeLob.subtitle}</div>
          </div>
          <ChevronDown size={12} className="text-white/50 group-hover:text-white/80" />
        </button>

        <div className="flex items-center gap-1.5">
          <GlassIconButton onClick={undo} title="Undo (⌘Z)"><Undo2 size={14} /></GlassIconButton>
          <GlassIconButton onClick={redo} title="Redo (⌘⇧Z)"><Redo2 size={14} /></GlassIconButton>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <div className="flex rounded-lg p-0.5" style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(10px)" }}>
            <button
              onClick={() => setDevice("desktop")}
              className={`p-1.5 rounded-md transition-all ${device === "desktop" ? "bg-white/15 text-white" : "text-white/50 hover:text-white/80"}`}
            >
              <Monitor size={13} />
            </button>
            <button
              onClick={() => setDevice("mobile")}
              className={`p-1.5 rounded-md transition-all ${device === "mobile" ? "bg-white/15 text-white" : "text-white/50 hover:text-white/80"}`}
            >
              <Smartphone size={13} />
            </button>
          </div>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <GlassIconButton onClick={() => setShowTour(true)} title="Guided tour"><HelpCircle size={14} /></GlassIconButton>
          <GlassIconButton onClick={() => setShowShortcuts(true)} title="Shortcuts"><Keyboard size={14} /></GlassIconButton>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button
            onClick={saveCurrent}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white rounded-lg"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <Save size={13} /> Save
          </button>
          <button
            onClick={() => setShowExport(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg hover:scale-[1.02] shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${tokens.accent}, ${tokens.accent}cc)`,
              boxShadow: `0 4px 16px ${tokens.accent}50`,
            }}
          >
            <Download size={13} /> Export
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Canvas */}
        <main className="flex-1 overflow-auto p-8" onClick={() => setSelectedId(null)}>
          <div className="mx-auto transition-all duration-300" style={{ maxWidth: canvasW }}>
            <div className="text-center py-3 text-[10px] text-white/40 font-medium">
              To view this email as a web page,{" "}
              <span style={{ color: tokens.linkColor, textDecoration: "underline" }}>click here</span>
            </div>
            <div
              className="rounded-xl overflow-hidden shadow-2xl"
              style={{
                backgroundColor: tokens.canvasBg,
                boxShadow: "0 25px 60px -15px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
              }}
            >
              <DropZone
                active={dragOver === 0}
                onDragOver={(e) => onCanvasDragOver(e, 0)}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => onCanvasDrop(e, 0)}
              />
              {blocks.length === 0 ? (
                <div
                  className="py-24 text-center text-slate-400"
                  onDragOver={(e) => onCanvasDragOver(e, 0)}
                  onDrop={(e) => onCanvasDrop(e, 0)}
                >
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                    style={{ background: "linear-gradient(135deg, rgba(148,163,184,0.15), rgba(148,163,184,0.05))" }}
                  >
                    <Layers className="text-slate-400" size={28} strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Drag snippets to start building</p>
                </div>
              ) : (
                blocks.map((b, i) => {
                  const snip = registry[b.snippet];
                  if (!snip) {
                    return (
                      <div key={b.id} className="p-4 text-xs text-red-400 bg-red-900/20 border border-red-800/30">
                        Missing snippet: <code>{b.snippet}</code>
                      </div>
                    );
                  }
                  const isSel = selectedId === b.id;
                  const Preview = snip.Preview;
                  return (
                    <React.Fragment key={b.id}>
                      <div
                        draggable
                        onDragStart={(e) => onBlockDragStart(e, b.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(b.id);
                          setActiveTab("properties");
                        }}
                        className="relative cursor-pointer transition-all"
                        style={isSel ? { boxShadow: `inset 0 0 0 2px ${tokens.accent}` } : {}}
                      >
                        <Preview b={b.data} t={tokens} device={device} />
                        {isSel && (
                          <div
                            className="absolute -top-8 right-2 flex items-center gap-0.5 rounded-lg px-1 py-1 z-10 shadow-lg"
                            style={{ background: tokens.accent }}
                          >
                            <span className="px-2 text-[10px] font-medium text-white">{snip.label}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateBlock(b.id);
                              }}
                              className="p-1 hover:bg-white/20 rounded text-white"
                            >
                              <Copy size={11} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteBlock(b.id);
                              }}
                              className="p-1 hover:bg-white/20 rounded text-white"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        )}
                      </div>
                      <DropZone
                        active={dragOver === i + 1}
                        onDragOver={(e) => onCanvasDragOver(e, i + 1)}
                        onDragLeave={() => setDragOver(null)}
                        onDrop={(e) => onCanvasDrop(e, i + 1)}
                      />
                    </React.Fragment>
                  );
                })
              )}
            </div>
            <div className="text-center mt-4 text-[10px] text-white/40 font-medium">
              {blocks.length} snippet{blocks.length !== 1 ? "s" : ""} · 648px · {device === "mobile" ? "Mobile" : "Desktop"}
            </div>
          </div>
        </main>

        {/* Right panel */}
        <aside
          className="w-96 flex flex-col shrink-0 border-l"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            {[
              { id: "snippets", label: "Snippets", icon: Layers },
              { id: "properties", label: "Edit", icon: FileCode },
              { id: "templates", label: "Templates", icon: FolderOpen },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all ${
                  activeTab === tab.id ? "text-white" : "text-white/50 hover:text-white/80"
                }`}
                style={activeTab === tab.id ? { borderBottom: `2px solid ${tokens.accent}` } : {}}
              >
                <tab.icon size={12} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto">
            {activeTab === "snippets" && (
              <div className="p-3">
                <div className="relative mb-3">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    value={snippetSearch}
                    onChange={(e) => setSnippetSearch(e.target.value)}
                    placeholder="Search snippets..."
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg text-white placeholder-white/40 focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                </div>
                <p className="text-[10px] text-white/40 mb-3 px-1 flex items-center gap-1.5">
                  <Wand2 size={10} /> Click or drag onto canvas
                </p>
                {Object.entries(grouped).map(([cat, items]) => (
                  <div key={cat} className="mb-4">
                    <p className="text-[10px] font-semibold text-white/70 px-1 mb-2 uppercase tracking-wider">{cat}</p>
                    <div className="space-y-1.5">
                      {items.map((s) => {
                        const Icon = s.icon;
                        return (
                          <div
                            key={s.id}
                            draggable
                            onDragStart={(e) => onPaletteDragStart(e, s.id)}
                            onClick={() => addBlock(s.id)}
                            className="flex items-center gap-2.5 p-2.5 rounded-lg cursor-grab active:cursor-grabbing transition-all hover:scale-[1.02] group"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                          >
                            <div
                              className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                              style={{
                                background: `linear-gradient(135deg, ${tokens.accent}30, ${tokens.accent}10)`,
                                border: `1px solid ${tokens.accent}30`,
                              }}
                            >
                              <Icon size={14} style={{ color: tokens.accent }} />
                            </div>
                            <span className="text-xs text-white/90 font-medium">{s.label}</span>
                            {s._custom && (
                              <span className="ml-auto px-1.5 py-0.5 text-[8px] rounded bg-purple-500/20 text-purple-300">
                                custom
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "properties" &&
              (selected && registry[selected.snippet] ? (
                <PropsPanel
                  block={selected}
                  snip={registry[selected.snippet]}
                  tokens={tokens}
                  propsMode={propsMode}
                  setPropsMode={setPropsMode}
                  onUpdate={(p) => updateData(selected.id, p)}
                  onUpdateNested={(pa, v) => updateNested(selected.id, pa, v)}
                  onResetOverride={(k) => resetOverride(selected.id, k)}
                  onDelete={() => deleteBlock(selected.id)}
                  onDuplicate={() => duplicateBlock(selected.id)}
                  onUpload={(f) => triggerUpload(selected.id, f)}
                />
              ) : (
                <EmptyProps />
              ))}

            {activeTab === "templates" && (
              <div className="p-3">
                <p className="text-[10px] font-semibold text-white/70 px-1 mb-2 uppercase tracking-wider">Starters</p>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {Object.entries(TEMPLATES).map(([k, tpl]) => {
                    const Icon = tpl.icon;
                    return (
                      <button
                        key={k}
                        onClick={() => loadTemplate(k)}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg transition-all hover:scale-[1.03]"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${tokens.accent}30, ${tokens.accent}10)` }}
                        >
                          <Icon size={16} style={{ color: tokens.accent }} />
                        </div>
                        <span className="text-[11px] font-medium text-white/90 text-center">{tpl.name}</span>
                      </button>
                    );
                  })}
                </div>

                <p className="text-[10px] font-semibold text-white/70 px-1 mb-2 uppercase tracking-wider">Email Settings</p>
                <div className="space-y-3 mb-5">
                  <GlassField label="Title" value={settings.title} onChange={(v) => setSettings({ ...settings, title: v })} />
                  <GlassField label="Preheader" value={settings.preheader} onChange={(v) => setSettings({ ...settings, preheader: v })} />
                </div>

                <button
                  onClick={() => setShowLobEditor(lobId)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:scale-[1.02] mb-2"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="flex items-center gap-2">
                    <Settings2 size={13} style={{ color: tokens.accent }} />
                    <span className="text-xs font-medium text-white/90">Edit current LOB tokens</span>
                  </div>
                  <ChevronRight size={13} className="text-white/40" />
                </button>

                {savedTemplates.length > 0 && (
                  <>
                    <p className="text-[10px] font-semibold text-white/70 px-1 mb-2 mt-5 uppercase tracking-wider">
                      Your Saved
                    </p>
                    <div className="space-y-1.5">
                      {savedTemplates.map((tpl, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            snapshot();
                            setBlocks(tpl.blocks.map((b) => ({ ...b, id: newId() })));
                            if (tpl.lobId && lobs[tpl.lobId]) {
                              setLobId(tpl.lobId);
                              setTokens(lobs[tpl.lobId].tokens);
                            }
                            setSelectedId(null);
                            flash(`Loaded "${tpl.name}"`);
                          }}
                          className="w-full flex items-center justify-between p-2.5 rounded-lg"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          <div className="text-left">
                            <p className="text-xs font-medium text-white/90">{tpl.name}</p>
                            <p className="text-[10px] text-white/50">
                              {tpl.blocks.length} snippets · {lobs[tpl.lobId]?.name || "—"}
                            </p>
                          </div>
                          <ChevronRight size={13} className="text-white/40" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={onFile} className="hidden" />

      {showLobModal && (
        <LobModal
          lobs={lobs}
          activeId={lobId}
          onSelect={switchLob}
          onClose={() => setShowLobModal(false)}
          onNew={() => {
            setShowLobModal(false);
            setShowLobEditor("new");
          }}
          onEdit={(id) => {
            setShowLobModal(false);
            setShowLobEditor(id);
          }}
        />
      )}
      {showLobEditor && (
        <LobEditor
          existing={showLobEditor !== "new" ? lobs[showLobEditor] : null}
          onSave={saveLob}
          onDelete={deleteLob}
          onClose={() => setShowLobEditor(null)}
        />
      )}
      {showExport && (
        <ExportModal
          html={buildShell({ blocks, settings, tokens, registry })}
          onClose={() => setShowExport(false)}
          flash={flash}
        />
      )}
      {showTour && <TourOverlay onClose={() => setShowTour(false)} />}
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}

      <Toast message={toast} />
    </div>
  );
}