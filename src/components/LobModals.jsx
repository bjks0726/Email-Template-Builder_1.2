import React, { useState } from "react";
import { Palette, Check, Plus, Settings2, Trash2, Zap } from "lucide-react";
import { ModalShell, GlassField } from "./UI.jsx";
import { BLANK_LOB_TOKENS } from "../lobs/defaults.jsx";
import { clone } from "../lib/tokens.jsx";

export function LobModal({ lobs, activeId, onSelect, onClose, onNew, onEdit }) {
  return (
    <ModalShell onClose={onClose} title="Line of Business" subtitle="Switch brand theme or create a new one" icon={Palette}>
      <div className="grid grid-cols-1 gap-3 mb-3">
        {Object.values(lobs).map((lob) => {
          const active = lob.id === activeId;
          return (
            <div
              key={lob.id}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{
                background: active
                  ? `linear-gradient(135deg, ${lob.tokens.accent}20, ${lob.tokens.accent}08)`
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${active ? lob.tokens.accent + "60" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              <button onClick={() => onSelect(lob.id)} className="flex-1 flex items-center gap-4 text-left">
                <div className="flex flex-col gap-1">
                  {lob.swatch.map((c, i) => (
                    <div
                      key={i}
                      className="w-8 h-4 rounded"
                      style={{ background: c, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)" }}
                    />
                  ))}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">{lob.name}</h3>
                    {active && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded text-white" style={{ background: lob.tokens.accent }}>
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/60 mt-0.5">{lob.subtitle}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-white/50">
                    <span>Font: <span className="text-white/70">{lob.tokens.fontStack.split(",")[0].replace(/['"]/g, "")}</span></span>
                    <span>CTA radius: <span className="text-white/70">{lob.tokens.ctaRadius}px</span></span>
                  </div>
                </div>
              </button>
              <button onClick={() => onEdit(lob.id)} className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10" title="Edit">
                <Settings2 size={14} />
              </button>
              {active && <Check size={16} style={{ color: lob.tokens.accent }} />}
            </div>
          );
        })}
      </div>
      <button
        onClick={onNew}
        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium text-white/90 hover:scale-[1.01]"
        style={{
          background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))",
          border: "1px dashed rgba(255,255,255,0.2)",
        }}
      >
        <Plus size={14} /> Create new LOB
      </button>
      <div
        className="mt-4 p-3 rounded-lg flex items-start gap-2"
        style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}
      >
        <Zap size={12} className="text-blue-300 mt-0.5 shrink-0" />
        <p className="text-[11px] text-blue-100/80 leading-relaxed">
          Switching rethemes the canvas instantly. Per-block overrides stay intact.
        </p>
      </div>
    </ModalShell>
  );
}

export function LobEditor({ existing, onSave, onDelete, onClose }) {
  const [lob, setLob] = useState(() =>
    existing
      ? clone(existing)
      : {
          id: `custom_${Date.now()}`,
          name: "New LOB",
          subtitle: "Custom brand",
          swatch: ["#1E40AF", "#FFFFFF", "#64748B"],
          tokens: { ...BLANK_LOB_TOKENS },
        },
  );
  const set = (path, val) => {
    setLob((prev) => {
      const next = clone(prev);
      const keys = path.split(".");
      let o = next;
      for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]];
      o[keys[keys.length - 1]] = val;
      return next;
    });
  };
  const setSwatch = (i, v) => {
    const s = [...lob.swatch];
    s[i] = v;
    setLob({ ...lob, swatch: s });
  };

  const colorGroups = [
    { title: "Backgrounds", items: [["outerBg", "Outer"], ["canvasBg", "Canvas"], ["footerBg", "Dark"]] },
    { title: "Headings", items: [["h1Color", "H1"], ["h2Color", "H2"], ["h3Color", "H3"]] },
    { title: "Text", items: [["bodyColor", "Body"], ["smallColor", "Small"], ["textLight", "Light"], ["linkColor", "Link"]] },
    { title: "CTA + Accent", items: [["ctaBg", "CTA BG"], ["ctaColor", "CTA text"], ["accent", "Accent"], ["divider", "Divider"]] },
  ];

  const cellStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" };

  return (
    <ModalShell onClose={onClose} title={existing ? `Edit ${existing.name}` : "Create LOB"} subtitle="Define brand tokens used across all snippets" icon={Palette} wide>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <GlassField label="Name" value={lob.name} onChange={(v) => setLob({ ...lob, name: v })} />
        <GlassField label="Subtitle" value={lob.subtitle} onChange={(v) => setLob({ ...lob, subtitle: v })} />
      </div>

      <div className="mb-5">
        <label className="text-[10px] font-medium text-white/60 mb-1 block uppercase tracking-wider">Swatch (3 colors for the picker)</label>
        <div className="flex gap-2">
          {lob.swatch.map((c, i) => (
            <input key={i} type="color" value={c} onChange={(e) => setSwatch(i, e.target.value)} className="w-12 h-12 rounded cursor-pointer" />
          ))}
        </div>
      </div>

      {colorGroups.map((g) => (
        <div key={g.title} className="mb-4">
          <p className="text-[10px] font-semibold text-white/70 mb-2 uppercase tracking-wider">{g.title}</p>
          <div className="grid grid-cols-4 gap-3">
            {g.items.map(([k, label]) => (
              <div key={k}>
                <label className="text-[9px] font-medium text-white/50 mb-1 block">{label}</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={lob.tokens[k] || "#000000"}
                    onChange={(e) => set(`tokens.${k}`, e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer"
                  />
                  <input
                    value={lob.tokens[k] || ""}
                    onChange={(e) => set(`tokens.${k}`, e.target.value)}
                    className="flex-1 px-1.5 py-1 text-[10px] rounded text-white/90 font-mono"
                    style={cellStyle}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mb-4">
        <p className="text-[10px] font-semibold text-white/70 mb-2 uppercase tracking-wider">Typography</p>
        <div className="mb-3">
          <label className="text-[9px] font-medium text-white/50 mb-1 block">Font stack</label>
          <input
            value={lob.tokens.fontStack}
            onChange={(e) => set("tokens.fontStack", e.target.value)}
            className="w-full px-2 py-1.5 text-xs rounded text-white/90 font-mono"
            style={cellStyle}
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            ["h1Size", "H1 size"], ["h2Size", "H2 size"], ["h3Size", "H3 size"], ["bodySize", "Body size"],
            ["h1Weight", "H1 wt"], ["h2Weight", "H2 wt"], ["h3Weight", "H3 wt"], ["bodyWeight", "Body wt"],
          ].map(([k, l]) => (
            <div key={k}>
              <label className="text-[9px] text-white/50 mb-1 block">{l}</label>
              <input
                type="number"
                value={lob.tokens[k]}
                onChange={(e) => set(`tokens.${k}`, +e.target.value)}
                className="w-full px-2 py-1 text-[11px] rounded text-white/90"
                style={cellStyle}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-[10px] font-semibold text-white/70 mb-2 uppercase tracking-wider">CTA</p>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[9px] text-white/50 mb-1 block">Radius</label>
            <input
              type="number"
              value={lob.tokens.ctaRadius}
              onChange={(e) => set("tokens.ctaRadius", +e.target.value)}
              className="w-full px-2 py-1 text-[11px] rounded text-white/90"
              style={cellStyle}
            />
          </div>
          <div>
            <label className="text-[9px] text-white/50 mb-1 block">Weight</label>
            <input
              type="number"
              value={lob.tokens.ctaWeight}
              onChange={(e) => set("tokens.ctaWeight", +e.target.value)}
              className="w-full px-2 py-1 text-[11px] rounded text-white/90"
              style={cellStyle}
            />
          </div>
          <div>
            <label className="text-[9px] text-white/50 mb-1 block">Transform</label>
            <select
              value={lob.tokens.ctaTransform}
              onChange={(e) => set("tokens.ctaTransform", e.target.value)}
              className="w-full px-2 py-1 text-[11px] rounded text-white/90"
              style={cellStyle}
            >
              <option value="none">none</option>
              <option value="uppercase">UPPERCASE</option>
              <option value="capitalize">Capitalize</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        {existing ? (
          <button
            onClick={() => {
              if (confirm(`Delete ${existing.name}?`)) onDelete(existing.id);
            }}
            className="px-3 py-2 text-xs text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg flex items-center gap-1.5"
          >
            <Trash2 size={12} /> Delete
          </button>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white/70 hover:text-white rounded-lg"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(lob)}
            className="px-4 py-2 text-xs font-semibold text-white rounded-lg flex items-center gap-1.5 hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
          >
            <Check size={13} /> {existing ? "Save" : "Create LOB"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
