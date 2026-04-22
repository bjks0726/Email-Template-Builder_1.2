import React from "react";
import {
  Copy, Trash2, FileCode, Type as TypeIcon, Image as ImageIcon,
  MousePointerClick, Layers3, Minus, MoveVertical, Maximize2, Calendar,
  Columns3, Zap, Wand2, Sliders, RotateCcw, ArrowLeftRight, Box,
  Heading1,
} from "lucide-react";
import {
  TextField, NumSlider, NumSliderWithReset, ColorField, ColorWithReset,
  AlignButtons, ImageUploadField, Collapsible,
} from "./UI.jsx";

export function EmptyProps() {
  return (
    <div className="p-6 text-center text-white/50 text-xs flex flex-col items-center gap-3 mt-8">
      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)" }}>
        <FileCode className="text-white/40" size={20} strokeWidth={1.5} />
      </div>
      <div>
        <p className="font-medium text-white/70 mb-1">No snippet selected</p>
        <p className="text-white/40">Click any element on the canvas to edit</p>
      </div>
    </div>
  );
}

export function PropsPanel({
  block, snip, tokens, propsMode, setPropsMode,
  onUpdate, onUpdateNested, onResetOverride,
  onDelete, onDuplicate, onUpload,
}) {
  const d = block.data;
  const propGroups = snip.props || [];

  const overrideKeys = [
    "headlineColor", "headlineSize", "headlineLine", "headlineWeight", "headlineTransform",
    "bodyColor", "bodySize", "bodyLine", "bodyWeight", "ctaBg", "ctaColor", "ctaRadius",
    "dividerColor",
  ];
  const overrideCount = overrideKeys.filter((k) => d[k] !== undefined).length;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3 pb-3 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${tokens.accent}30, ${tokens.accent}10)`, border: `1px solid ${tokens.accent}30` }}
          >
            <snip.icon size={13} style={{ color: tokens.accent }} />
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider text-white/50 font-semibold">Editing</p>
            <p className="text-xs font-semibold text-white">{snip.label}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onDuplicate}
            title="Duplicate (⌘D)"
            className="p-1.5 rounded-lg text-white/60 hover:text-white"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <Copy size={12} />
          </button>
          <button
            onClick={onDelete}
            title="Delete (⌫)"
            className="p-1.5 rounded-lg text-red-300 hover:text-red-200 hover:bg-red-500/10"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div className="flex rounded-lg p-0.5 mb-4" style={{ background: "rgba(255,255,255,0.05)" }}>
        <button
          onClick={() => setPropsMode("basic")}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-medium rounded-md transition-all ${
            propsMode === "basic" ? "bg-white/10 text-white" : "text-white/50"
          }`}
        >
          <Wand2 size={11} /> Basic
        </button>
        <button
          onClick={() => setPropsMode("advanced")}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-medium rounded-md transition-all relative ${
            propsMode === "advanced" ? "bg-white/10 text-white" : "text-white/50"
          }`}
        >
          <Sliders size={11} /> Advanced
          {overrideCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center"
              style={{ background: tokens.accent, color: "white" }}
            >
              {overrideCount}
            </span>
          )}
        </button>
      </div>

      {/* Custom snippet: render its self-declared fields */}
      {snip._custom && (
        <Collapsible title="Fields" icon={Box} defaultOpen>
          <CustomFields fields={snip._fields} b={d} onUpdate={onUpdate} onUpload={onUpload} />
        </Collapsible>
      )}

      {/* Built-in groups */}
      {propGroups.includes("content") && <ContentGroup b={d} block={block} onUpdate={onUpdate} />}
      {propGroups.includes("twinCta") && <TwinCtaContent b={d} onUpdate={onUpdate} />}
      {propGroups.includes("twinText") && <TwinTextContent b={d} onUpdate={onUpdate} />}
      {propGroups.includes("twoDates") && <TwoDatesContent b={d} onUpdateNested={onUpdateNested} />}
      {propGroups.includes("threeCol") && <ThreeColContent b={d} onUpdateNested={onUpdateNested} />}
      {propGroups.includes("threeColSimple") && <ThreeColSimpleContent b={d} onUpdateNested={onUpdateNested} />}
      {propGroups.includes("header") && <HeaderContent b={d} onUpdate={onUpdate} onUpload={onUpload} />}

      {propGroups.includes("image") && (
        <Collapsible title="Image" icon={ImageIcon} defaultOpen>
          <ImageFields b={d} block={block} onUpdate={onUpdate} onUpload={onUpload} propsMode={propsMode} />
        </Collapsible>
      )}

      {propsMode === "advanced" && propGroups.includes("typography") && (
        <Collapsible title="Typography" icon={TypeIcon} badge="overrides">
          <TypographyFields b={d} onUpdate={onUpdate} tokens={tokens} onResetOverride={onResetOverride} />
        </Collapsible>
      )}

      {propsMode === "advanced" && propGroups.includes("cta") && (
        <Collapsible title="CTA" icon={MousePointerClick} badge="overrides">
          <CtaFields b={d} onUpdate={onUpdate} tokens={tokens} onResetOverride={onResetOverride} />
        </Collapsible>
      )}

      {propGroups.includes("layout") && (
        <Collapsible title="Layout" icon={Layers3}>
          <LayoutFields b={d} onUpdate={onUpdate} tokens={tokens} />
        </Collapsible>
      )}

      {propGroups.includes("divider") && (
        <Collapsible title="Divider" icon={Minus} defaultOpen>
          <NumSlider label="Thickness" val={d.thickness} onCh={(v) => onUpdate({ thickness: v })} min={1} max={10} />
          {propsMode === "advanced" && (
            <ColorWithReset
              label="Color"
              val={d.dividerColor ?? tokens.divider}
              isOverride={d.dividerColor !== undefined}
              onCh={(v) => onUpdate({ dividerColor: v })}
              onReset={() => onResetOverride("dividerColor")}
            />
          )}
        </Collapsible>
      )}

      {propGroups.includes("spacer") && (
        <Collapsible title="Spacer" icon={MoveVertical} defaultOpen>
          <NumSlider label="Height" val={d.height} onCh={(v) => onUpdate({ height: v })} min={4} max={120} />
        </Collapsible>
      )}

      {propsMode === "advanced" && propGroups.includes("spacing") && (
        <Collapsible title="Padding" icon={Maximize2}>
          <PaddingFields b={d} onUpdate={onUpdate} />
        </Collapsible>
      )}
    </div>
  );
}

// === Custom snippet fields (renders from schema) ===
function CustomFields({ fields, b, onUpdate, onUpload }) {
  return (
    <>
      {fields.map((f) => {
        const common = { key: f.key };
        if (f.type === "text" || f.type === "url") {
          return (
            <TextField
              {...common}
              label={f.label}
              val={b[f.key]}
              onCh={(v) => onUpdate({ [f.key]: v })}
              placeholder={f.placeholder}
            />
          );
        }
        if (f.type === "textarea") {
          return (
            <TextField
              {...common}
              label={f.label}
              val={b[f.key]}
              onCh={(v) => onUpdate({ [f.key]: v })}
              rows={f.rows || 3}
              placeholder={f.placeholder}
            />
          );
        }
        if (f.type === "color") {
          return <ColorField {...common} label={f.label} val={b[f.key]} onCh={(v) => onUpdate({ [f.key]: v })} />;
        }
        if (f.type === "number") {
          return (
            <NumSlider
              {...common}
              label={f.label}
              val={b[f.key] ?? f.default ?? 0}
              onCh={(v) => onUpdate({ [f.key]: v })}
              min={f.min ?? 0}
              max={f.max ?? 100}
              suf={f.suf ?? "px"}
            />
          );
        }
        if (f.type === "image") {
          return (
            <ImageUploadField
              {...common}
              label={f.label}
              val={b[f.key]}
              field={f.key}
              onUrl={(v) => onUpdate({ [f.key]: v })}
              onUpload={onUpload}
            />
          );
        }
        if (f.type === "select") {
          return (
            <div key={f.key} className="mb-3">
              <label className="text-[10px] font-medium text-white/60 mb-1 block uppercase tracking-wider">{f.label}</label>
              <select
                value={b[f.key] ?? f.default ?? ""}
                onChange={(e) => onUpdate({ [f.key]: e.target.value })}
                className="w-full px-2 py-1.5 text-xs rounded-lg text-white/90"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {(f.options || []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          );
        }
        return null;
      })}
    </>
  );
}

// === Built-in content groups ===
function ContentGroup({ b, block, onUpdate }) {
  const type = block.snippet;
  return (
    <Collapsible title="Content" icon={TypeIcon} defaultOpen>
      {type === "promo_code" ? (
        <>
          <TextField label="Intro text" val={b.body} onCh={(v) => onUpdate({ body: v })} rows={2} />
          <TextField label="Promo code" val={b.code} onCh={(v) => onUpdate({ code: v })} />
        </>
      ) : type === "headline_subtitle" ? (
        <>
          <TextField label="Headline" val={b.headline} onCh={(v) => onUpdate({ headline: v })} />
          <TextField label="Subtitle" val={b.subtitle} onCh={(v) => onUpdate({ subtitle: v })} />
          <TextField label="Body" val={b.body} onCh={(v) => onUpdate({ body: v })} rows={3} />
        </>
      ) : (
        <>
          <TextField label="Headline" val={b.headline} onCh={(v) => onUpdate({ headline: v })} />
          <TextField label="Body" val={b.body} onCh={(v) => onUpdate({ body: v })} rows={3} />
          {b.ctaText !== undefined && (
            <>
              <TextField label="CTA label" val={b.ctaText} onCh={(v) => onUpdate({ ctaText: v })} />
              <TextField label="CTA URL" val={b.ctaUrl} onCh={(v) => onUpdate({ ctaUrl: v })} />
            </>
          )}
        </>
      )}
    </Collapsible>
  );
}

function TwinCtaContent({ b, onUpdate }) {
  return (
    <Collapsible title="CTAs" icon={Zap} defaultOpen>
      <TextField label="CTA 1 label" val={b.cta1Text} onCh={(v) => onUpdate({ cta1Text: v })} />
      <TextField label="CTA 1 URL" val={b.cta1Url} onCh={(v) => onUpdate({ cta1Url: v })} />
      <TextField label="CTA 2 label" val={b.cta2Text} onCh={(v) => onUpdate({ cta2Text: v })} />
      <TextField label="CTA 2 URL" val={b.cta2Url} onCh={(v) => onUpdate({ cta2Url: v })} />
    </Collapsible>
  );
}

function TwinTextContent({ b, onUpdate }) {
  return (
    <Collapsible title="Content" icon={TypeIcon} defaultOpen>
      <TextField label="Column 1 text" val={b.text1} onCh={(v) => onUpdate({ text1: v })} rows={4} />
      <TextField label="Column 2 text" val={b.text2} onCh={(v) => onUpdate({ text2: v })} rows={4} />
    </Collapsible>
  );
}

function TwoDatesContent({ b, onUpdateNested }) {
  return [1, 2].map((n) => {
    const k = `date${n}`;
    return (
      <Collapsible key={n} title={`Date ${n}`} icon={Calendar} defaultOpen={n === 1}>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-[10px] text-white/60 uppercase tracking-wider mb-1 block">Day</label>
            <input
              value={b[k].day}
              onChange={(e) => onUpdateNested(`${k}.day`, e.target.value)}
              className="w-full px-2 py-1.5 text-xs rounded-lg text-white/90"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>
          <div>
            <label className="text-[10px] text-white/60 uppercase tracking-wider mb-1 block">Month</label>
            <input
              value={b[k].month}
              onChange={(e) => onUpdateNested(`${k}.month`, e.target.value)}
              className="w-full px-2 py-1.5 text-xs rounded-lg text-white/90"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>
        </div>
        <TextField label="Title" val={b[k].title} onCh={(v) => onUpdateNested(`${k}.title`, v)} />
        <TextField label="Subtitle" val={b[k].subtitle} onCh={(v) => onUpdateNested(`${k}.subtitle`, v)} />
        <TextField label="CTA label" val={b[k].ctaText} onCh={(v) => onUpdateNested(`${k}.ctaText`, v)} />
        <TextField label="CTA URL" val={b[k].ctaUrl} onCh={(v) => onUpdateNested(`${k}.ctaUrl`, v)} />
      </Collapsible>
    );
  });
}

function ThreeColContent({ b, onUpdateNested }) {
  return [1, 2, 3].map((n) => {
    const k = `col${n}`;
    return (
      <Collapsible key={n} title={`Column ${n}`} icon={Columns3} defaultOpen={n === 1}>
        <TextField label="Headline" val={b[k].headline} onCh={(v) => onUpdateNested(`${k}.headline`, v)} />
        <TextField label="Body" val={b[k].body} onCh={(v) => onUpdateNested(`${k}.body`, v)} rows={2} />
        <TextField label="CTA" val={b[k].ctaText} onCh={(v) => onUpdateNested(`${k}.ctaText`, v)} />
      </Collapsible>
    );
  });
}

function ThreeColSimpleContent({ b, onUpdateNested }) {
  return [1, 2, 3].map((n) => {
    const k = `col${n}`;
    return (
      <Collapsible key={n} title={`Column ${n}`} icon={Columns3} defaultOpen={n === 1}>
        <TextField label="Headline" val={b[k].headline} onCh={(v) => onUpdateNested(`${k}.headline`, v)} />
      </Collapsible>
    );
  });
}

function HeaderContent({ b, onUpdate, onUpload }) {
  const setNav = (i, field, value) => {
    const next = [...b.navItems];
    next[i] = { ...next[i], [field]: value };
    onUpdate({ navItems: next });
  };
  const addNav = () => onUpdate({ navItems: [...b.navItems, { label: "New", url: "#" }] });
  const removeNav = (i) => onUpdate({ navItems: b.navItems.filter((_, idx) => idx !== i) });

  return (
    <>
      <Collapsible title="Logo / Header Image" icon={Heading1} defaultOpen>
        <ImageUploadField
          label="Logo image"
          val={b.logoSrc}
          field="logoSrc"
          onUrl={(v) => onUpdate({ logoSrc: v })}
          onUpload={onUpload}
        />
        <TextField label="Logo alt text" val={b.logoAlt} onCh={(v) => onUpdate({ logoAlt: v })} />
        <TextField label="Logo link URL" val={b.logoLink} onCh={(v) => onUpdate({ logoLink: v })} />
        <NumSlider label="Logo width (px)" val={b.logoWidth} onCh={(v) => onUpdate({ logoWidth: v })} min={200} max={696} />
      </Collapsible>
      <Collapsible title="Navigation" icon={Columns3} defaultOpen>
        <div className="mb-3 flex items-center gap-2">
          <input
            type="checkbox"
            checked={b.showNav}
            onChange={(e) => onUpdate({ showNav: e.target.checked })}
            className="accent-blue-500"
          />
          <span className="text-xs text-white/80">Show nav</span>
        </div>
        <div className="mb-3 flex items-center gap-2">
          <input
            type="checkbox"
            checked={b.showDividers}
            onChange={(e) => onUpdate({ showDividers: e.target.checked })}
            className="accent-blue-500"
          />
          <span className="text-xs text-white/80">Show dividers</span>
        </div>
        {b.showNav &&
          b.navItems.map((item, i) => (
            <div key={i} className="mb-3 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-white/60 uppercase tracking-wider">Item {i + 1}</span>
                <button
                  onClick={() => removeNav(i)}
                  className="p-1 text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded"
                >
                  <Trash2 size={10} />
                </button>
              </div>
              <TextField label="Label" val={item.label} onCh={(v) => setNav(i, "label", v)} />
              <TextField label="URL" val={item.url} onCh={(v) => setNav(i, "url", v)} />
            </div>
          ))}
        {b.showNav && (
          <button
            onClick={addNav}
            className="w-full py-2 text-xs text-white/70 hover:text-white rounded-lg"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.15)" }}
          >
            + Add nav item
          </button>
        )}
      </Collapsible>
    </>
  );
}

function ImageFields({ b, block, onUpdate, onUpload, propsMode }) {
  const type = block.snippet;
  if (type === "three_col_img_content" || type === "three_col_img") {
    return (
      <>
        <p className="text-[10px] text-white/50 mb-2">Edit each column's image in Content sections above.</p>
        {propsMode === "advanced" && (
          <NumSlider
            label="Border radius"
            val={b.imgRadius}
            onCh={(v) => onUpdate({ imgRadius: v })}
            min={0}
            max={40}
          />
        )}
      </>
    );
  }
  const isMediaOnly = type === "hero_image" || type === "banner";
  const srcKey = isMediaOnly ? "src" : "imgSrc";
  const altKey = isMediaOnly ? "alt" : "imgAlt";
  const linkKey = isMediaOnly ? "link" : "imgLink";
  const widthKey = isMediaOnly ? "width" : "imgWidth";
  return (
    <>
      <ImageUploadField
        label="Image"
        val={b[srcKey]}
        field={srcKey}
        onUrl={(v) => onUpdate({ [srcKey]: v })}
        onUpload={onUpload}
      />
      <TextField label="Alt text" val={b[altKey]} onCh={(v) => onUpdate({ [altKey]: v })} />
      <TextField label="Link URL" val={b[linkKey]} onCh={(v) => onUpdate({ [linkKey]: v })} />
      {propsMode === "advanced" && (
        <>
          <NumSlider label="Width %" val={b[widthKey]} onCh={(v) => onUpdate({ [widthKey]: v })} min={20} max={100} suf="%" />
          <NumSlider label="Border radius" val={b.imgRadius} onCh={(v) => onUpdate({ imgRadius: v })} min={0} max={40} />
          {isMediaOnly && (
            <>
              <NumSlider label="Border width" val={b.borderWidth} onCh={(v) => onUpdate({ borderWidth: v })} min={0} max={10} />
              {b.borderWidth > 0 && <ColorField label="Border color" val={b.borderColor} onCh={(v) => onUpdate({ borderColor: v })} />}
              <AlignButtons label="Alignment" val={b.align} onCh={(v) => onUpdate({ align: v })} />
            </>
          )}
        </>
      )}
    </>
  );
}

function TypographyFields({ b, onUpdate, tokens, onResetOverride }) {
  return (
    <>
      <p className="text-[10px] text-white/50 mb-2 font-semibold">Headline</p>
      <ColorWithReset
        label="Color"
        val={b.headlineColor ?? tokens.h1Color}
        isOverride={b.headlineColor !== undefined}
        onCh={(v) => onUpdate({ headlineColor: v })}
        onReset={() => onResetOverride("headlineColor")}
      />
      <NumSliderWithReset
        label="Font size"
        val={b.headlineSize}
        tokenVal={tokens.h1Size}
        isOverride={b.headlineSize !== undefined}
        onCh={(v) => onUpdate({ headlineSize: v })}
        onReset={() => onResetOverride("headlineSize")}
        min={12}
        max={64}
      />
      <NumSliderWithReset
        label="Line height"
        val={b.headlineLine}
        tokenVal={tokens.h1Line}
        isOverride={b.headlineLine !== undefined}
        onCh={(v) => onUpdate({ headlineLine: v })}
        onReset={() => onResetOverride("headlineLine")}
        min={14}
        max={80}
      />
      <NumSliderWithReset
        label="Weight"
        val={b.headlineWeight}
        tokenVal={tokens.h1Weight}
        isOverride={b.headlineWeight !== undefined}
        onCh={(v) => onUpdate({ headlineWeight: v })}
        onReset={() => onResetOverride("headlineWeight")}
        min={100}
        max={900}
        suf=""
      />
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10px] font-medium text-white/60 uppercase tracking-wider flex items-center gap-1">
            Transform{" "}
            {b.headlineTransform === undefined && (
              <span className="px-1 py-0.5 rounded text-[8px] bg-blue-500/20 text-blue-300 normal-case">from LOB</span>
            )}
          </label>
          {b.headlineTransform !== undefined && (
            <button onClick={() => onResetOverride("headlineTransform")} className="p-0.5 text-white/40 hover:text-white/80">
              <RotateCcw size={10} />
            </button>
          )}
        </div>
        <select
          value={b.headlineTransform ?? tokens.h1Transform}
          onChange={(e) => onUpdate({ headlineTransform: e.target.value })}
          className="w-full px-2 py-1.5 text-xs rounded-lg text-white/90"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <option value="none">none</option>
          <option value="uppercase">UPPERCASE</option>
          <option value="capitalize">Capitalize</option>
        </select>
      </div>
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] text-white/50 mb-2 font-semibold">Body</p>
      <ColorWithReset
        label="Color"
        val={b.bodyColor ?? tokens.bodyColor}
        isOverride={b.bodyColor !== undefined}
        onCh={(v) => onUpdate({ bodyColor: v })}
        onReset={() => onResetOverride("bodyColor")}
      />
      <NumSliderWithReset
        label="Font size"
        val={b.bodySize}
        tokenVal={tokens.bodySize}
        isOverride={b.bodySize !== undefined}
        onCh={(v) => onUpdate({ bodySize: v })}
        onReset={() => onResetOverride("bodySize")}
        min={10}
        max={28}
      />
      <NumSliderWithReset
        label="Line height"
        val={b.bodyLine}
        tokenVal={tokens.bodyLine}
        isOverride={b.bodyLine !== undefined}
        onCh={(v) => onUpdate({ bodyLine: v })}
        onReset={() => onResetOverride("bodyLine")}
        min={12}
        max={40}
      />
    </>
  );
}

function CtaFields({ b, onUpdate, tokens, onResetOverride }) {
  return (
    <>
      <ColorWithReset
        label="Background"
        val={b.ctaBg ?? tokens.ctaBg}
        isOverride={b.ctaBg !== undefined}
        onCh={(v) => onUpdate({ ctaBg: v })}
        onReset={() => onResetOverride("ctaBg")}
      />
      <ColorWithReset
        label="Text color"
        val={b.ctaColor ?? tokens.ctaColor}
        isOverride={b.ctaColor !== undefined}
        onCh={(v) => onUpdate({ ctaColor: v })}
        onReset={() => onResetOverride("ctaColor")}
      />
      <NumSliderWithReset
        label="Border radius"
        val={b.ctaRadius}
        tokenVal={tokens.ctaRadius}
        isOverride={b.ctaRadius !== undefined}
        onCh={(v) => onUpdate({ ctaRadius: v })}
        onReset={() => onResetOverride("ctaRadius")}
        min={0}
        max={40}
      />
      <NumSlider label="Width" val={b.ctaWidth ?? 240} onCh={(v) => onUpdate({ ctaWidth: v })} min={80} max={500} />
      <NumSlider label="Font size" val={b.ctaFontSize ?? 18} onCh={(v) => onUpdate({ ctaFontSize: v })} min={10} max={28} />
      <NumSlider label="Padding (vertical)" val={b.ctaPy ?? 8} onCh={(v) => onUpdate({ ctaPy: v })} min={4} max={30} />
      <NumSlider label="Padding (horizontal)" val={b.ctaPx ?? 26} onCh={(v) => onUpdate({ ctaPx: v })} min={6} max={60} />
    </>
  );
}

function LayoutFields({ b, onUpdate, tokens }) {
  return (
    <div className="mb-3">
      <label className="text-[10px] font-medium text-white/60 mb-1 block uppercase tracking-wider">Column order</label>
      <button
        onClick={() => onUpdate({ invert: !b.invert })}
        className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg transition-all"
        style={
          b.invert
            ? { background: `linear-gradient(135deg, ${tokens.accent}, ${tokens.accent}cc)`, color: "white" }
            : {
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.8)",
              }
        }
      >
        <ArrowLeftRight size={12} /> {b.invert ? "Text ◄ Image" : "Image ► Text"}
      </button>
    </div>
  );
}

function PaddingFields({ b, onUpdate }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <NumSlider label="Top" val={b.pt ?? 0} onCh={(v) => onUpdate({ pt: v })} min={0} max={80} />
      <NumSlider label="Right" val={b.pr ?? 0} onCh={(v) => onUpdate({ pr: v })} min={0} max={80} />
      <NumSlider label="Bottom" val={b.pb ?? 0} onCh={(v) => onUpdate({ pb: v })} min={0} max={80} />
      <NumSlider label="Left" val={b.pl ?? 0} onCh={(v) => onUpdate({ pl: v })} min={0} max={80} />
    </div>
  );
}
