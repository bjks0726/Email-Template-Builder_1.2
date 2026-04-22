import React, { useState } from "react";
import { X, ChevronDown, RotateCcw, AlignLeft, AlignCenter, AlignRight, Trash2, Image as ImageIcon } from "lucide-react";

export function GlassIconButton({ children, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="p-1.5 rounded-lg text-white/60 hover:text-white transition-all hover:scale-110"
      style={{ background: "rgba(255,255,255,0.04)" }}
    >
      {children}
    </button>
  );
}

export function DropZone({ active, ...rest }) {
  return (
    <div
      {...rest}
      className={`transition-all ${active ? "h-12" : "h-1"}`}
      style={
        active
          ? {
              background:
                "linear-gradient(90deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15), rgba(59,130,246,0.15))",
              border: "2px dashed rgba(59,130,246,0.5)",
            }
          : {}
      }
    />
  );
}

export function GlassField({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="text-[10px] font-medium text-white/60 mb-1 block uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(type === "number" ? +e.target.value : e.target.value)}
        placeholder={placeholder}
        className="w-full px-2.5 py-1.5 text-xs rounded-lg text-white/90 placeholder-white/30 focus:outline-none"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
      />
    </div>
  );
}

export function ModalShell({ children, onClose, title, subtitle, icon: Icon, wide = false }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(2,6,23,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className={`w-full ${wide ? "max-w-5xl" : "max-w-lg"} max-h-[85vh] flex flex-col rounded-2xl overflow-hidden animate-slide-up`}
        style={{
          background: "linear-gradient(180deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.97) 100%)",
          backdropFilter: "blur(40px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3">
            {Icon && (
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.3))" }}
              >
                <Icon size={17} className="text-white" />
              </div>
            )}
            <div>
              <h2 className="text-base font-semibold text-white">{title}</h2>
              {subtitle && <p className="text-xs text-white/60 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-5">{children}</div>
      </div>
    </div>
  );
}

export function Collapsible({ title, icon: Icon, children, defaultOpen = false, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="mb-3 rounded-lg overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-1.5">
          <Icon size={11} className="text-white/60" />
          <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wider">{title}</span>
          {badge && (
            <span className="px-1.5 py-0.5 rounded text-[8px] bg-amber-500/20 text-amber-300 normal-case">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown size={12} className={`text-white/50 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}

export function TextField({ label, val, onCh, rows = 1, placeholder }) {
  return (
    <div className="mb-3">
      <label className="text-[10px] font-medium text-white/60 mb-1 block uppercase tracking-wider">{label}</label>
      {rows > 1 ? (
        <textarea
          value={val || ""}
          onChange={(e) => onCh(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full px-2.5 py-1.5 text-xs rounded-lg text-white/90 resize-none focus:outline-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        />
      ) : (
        <input
          value={val || ""}
          onChange={(e) => onCh(e.target.value)}
          placeholder={placeholder}
          className="w-full px-2.5 py-1.5 text-xs rounded-lg text-white/90 focus:outline-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        />
      )}
    </div>
  );
}

export function NumSlider({ label, val, onCh, min, max, suf = "px" }) {
  return (
    <div className="mb-3">
      <label className="text-[10px] font-medium text-white/60 mb-1 block uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          value={val ?? 0}
          onChange={(e) => onCh(+e.target.value)}
          className="flex-1 accent-white"
        />
        <span className="text-[11px] text-white/70 w-12 text-right font-mono">
          {val ?? 0}
          {suf}
        </span>
      </div>
    </div>
  );
}

export function NumSliderWithReset({ label, val, tokenVal, isOverride, onCh, onReset, min, max, suf = "px" }) {
  const effective = isOverride ? val : tokenVal;
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <label className="text-[10px] font-medium text-white/60 uppercase tracking-wider flex items-center gap-1">
          {label}{" "}
          {!isOverride && (
            <span className="px-1 py-0.5 rounded text-[8px] bg-blue-500/20 text-blue-300 normal-case">from LOB</span>
          )}
        </label>
        {isOverride && (
          <button onClick={onReset} className="p-0.5 text-white/40 hover:text-white/80" title="Reset to LOB">
            <RotateCcw size={10} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          value={effective ?? 0}
          onChange={(e) => onCh(+e.target.value)}
          className="flex-1 accent-white"
        />
        <span className="text-[11px] text-white/70 w-12 text-right font-mono">
          {effective ?? 0}
          {suf}
        </span>
      </div>
    </div>
  );
}

export function ColorField({ label, val, onCh }) {
  return (
    <div className="mb-3">
      <label className="text-[10px] font-medium text-white/60 mb-1 block uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={val || "#000000"}
          onChange={(e) => onCh(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer"
        />
        <input
          value={val || ""}
          onChange={(e) => onCh(e.target.value)}
          className="flex-1 px-2 py-1.5 text-xs rounded-lg text-white/90 font-mono"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        />
      </div>
    </div>
  );
}

export function ColorWithReset({ label, val, isOverride, onCh, onReset }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <label className="text-[10px] font-medium text-white/60 uppercase tracking-wider flex items-center gap-1">
          {label}{" "}
          {!isOverride && (
            <span className="px-1 py-0.5 rounded text-[8px] bg-blue-500/20 text-blue-300 normal-case">from LOB</span>
          )}
        </label>
        {isOverride && (
          <button onClick={onReset} className="p-0.5 text-white/40 hover:text-white/80" title="Reset to LOB">
            <RotateCcw size={10} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={val || "#000000"}
          onChange={(e) => onCh(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer"
        />
        <input
          value={val || ""}
          onChange={(e) => onCh(e.target.value)}
          className="flex-1 px-2 py-1.5 text-[11px] rounded-lg text-white/90 font-mono"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        />
      </div>
    </div>
  );
}

export function AlignButtons({ label, val, onCh }) {
  return (
    <div className="mb-3">
      <label className="text-[10px] font-medium text-white/60 mb-1 block uppercase tracking-wider">{label}</label>
      <div className="flex gap-1 rounded-lg p-0.5" style={{ background: "rgba(255,255,255,0.05)" }}>
        {[
          ["left", AlignLeft],
          ["center", AlignCenter],
          ["right", AlignRight],
        ].map(([a, Icon]) => (
          <button
            key={a}
            onClick={() => onCh(a)}
            className={`flex-1 flex items-center justify-center py-1.5 text-[11px] rounded-md transition-all ${
              val === a ? "bg-white/15 text-white" : "text-white/50"
            }`}
          >
            <Icon size={12} />
          </button>
        ))}
      </div>
    </div>
  );
}

export function ImageUploadField({ label, val, field, onUrl, onUpload }) {
  return (
    <div className="mb-3">
      <label className="text-[10px] font-medium text-white/60 mb-1 block uppercase tracking-wider">{label}</label>
      {val ? (
        <div className="relative mb-2 rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <img src={val} alt="" className="w-full block" />
          <button
            onClick={() => onUrl("")}
            className="absolute top-1.5 right-1.5 p-1.5 rounded-lg text-red-300"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }}
          >
            <Trash2 size={11} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => onUpload(field)}
          className="w-full py-6 rounded-lg text-xs text-white/60 hover:text-white/90 flex flex-col items-center gap-1.5 mb-2"
          style={{ background: "rgba(255,255,255,0.03)", border: "2px dashed rgba(255,255,255,0.15)" }}
        >
          <ImageIcon size={18} /> Upload image
        </button>
      )}
      <input
        value={val?.startsWith("data:") ? "" : val || ""}
        onChange={(e) => onUrl(e.target.value)}
        placeholder="or paste URL"
        className="w-full px-2.5 py-1.5 text-xs rounded-lg text-white/90 placeholder-white/30 font-mono"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
      />
    </div>
  );
}

export function Toast({ message }) {
  if (!message) return null;
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg text-xs font-medium text-white shadow-2xl animate-slide-up"
      style={{
        background: "rgba(15,23,42,0.9)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {message}
    </div>
  );
}
