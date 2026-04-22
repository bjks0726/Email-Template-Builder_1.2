// Token resolution helpers.
// Pattern: block-level prop if set, otherwise fall back to LOB token.

/** Resolve a token with block-level override fallback. */
export function R(block, tokens, key) {
  const v = block[key];
  if (v !== undefined && v !== "" && v !== null) return v;
  return tokens[key];
}

/** Build a CSS padding string from block padding props. */
export function padCss(block, defaults = {}) {
  const pt = block.pt ?? defaults.pt ?? 0;
  const pr = block.pr ?? defaults.pr ?? 0;
  const pb = block.pb ?? defaults.pb ?? 0;
  const pl = block.pl ?? defaults.pl ?? 0;
  return `padding:${pt}px ${pr}px ${pb}px ${pl}px;`;
}

/** Inline style object for preview (React). */
export function padStyle(block, defaults = {}) {
  return {
    paddingTop: block.pt ?? defaults.pt ?? 0,
    paddingRight: block.pr ?? defaults.pr ?? 0,
    paddingBottom: block.pb ?? defaults.pb ?? 0,
    paddingLeft: block.pl ?? defaults.pl ?? 0,
  };
}

/** Headline style object (preview). */
export function headlineStyle(b, t, level = "h1") {
  return {
    fontSize: b.headlineSize ?? t[`${level}Size`],
    lineHeight: `${b.headlineLine ?? t[`${level}Line`]}px`,
    fontWeight: b.headlineWeight ?? t[`${level}Weight`],
    color: b.headlineColor ?? t[`${level}Color`],
    textTransform: b.headlineTransform ?? t[`${level}Transform`],
    margin: 0,
    fontFamily: t.fontStack,
    textAlign: b.headlineAlign ?? "center",
  };
}

/** Headline CSS string (export HTML). */
export function headlineCSS(b, t, level = "h1") {
  return (
    `font-size:${b.headlineSize ?? t[`${level}Size`]}px;` +
    `line-height:${b.headlineLine ?? t[`${level}Line`]}px;` +
    `font-weight:${b.headlineWeight ?? t[`${level}Weight`]};` +
    `color:${b.headlineColor ?? t[`${level}Color`]};` +
    `text-transform:${b.headlineTransform ?? t[`${level}Transform`]};` +
    `text-align:${b.headlineAlign ?? "center"};` +
    `margin:0;`
  );
}

export function bodyStyle(b, t) {
  return {
    fontSize: b.bodySize ?? t.bodySize,
    lineHeight: `${b.bodyLine ?? t.bodyLine}px`,
    fontWeight: b.bodyWeight ?? t.bodyWeight,
    color: b.bodyColor ?? t.bodyColor,
    textAlign: b.bodyAlign ?? "center",
    fontFamily: t.fontStack,
    margin: 0,
  };
}

export function bodyCSS(b, t) {
  return (
    `font-size:${b.bodySize ?? t.bodySize}px;` +
    `line-height:${b.bodyLine ?? t.bodyLine}px;` +
    `font-weight:${b.bodyWeight ?? t.bodyWeight};` +
    `color:${b.bodyColor ?? t.bodyColor};` +
    `text-align:${b.bodyAlign ?? "center"};` +
    `margin:0;`
  );
}

/** CTA inline style for preview (React). */
export function ctaPreviewStyle(b, t) {
  return {
    display: "inline-block",
    backgroundColor: R(b, t, "ctaBg"),
    color: R(b, t, "ctaColor"),
    padding: `${b.ctaPy ?? 8}px ${b.ctaPx ?? 26}px`,
    borderRadius: R(b, t, "ctaRadius"),
    textDecoration: "none",
    fontWeight: R(b, t, "ctaWeight"),
    fontSize: b.ctaFontSize ?? 18,
    textTransform: R(b, t, "ctaTransform"),
    letterSpacing: 0.3,
    fontFamily: t.fontStack,
    minWidth: b.ctaWidth ? `${Math.min(b.ctaWidth, 500)}px` : "auto",
    textAlign: "center",
  };
}

/** CTA HTML string (export). */
export function ctaHTML(b, t) {
  const bg = R(b, t, "ctaBg");
  const col = R(b, t, "ctaColor");
  const rad = R(b, t, "ctaRadius");
  const tr = R(b, t, "ctaTransform");
  const wt = R(b, t, "ctaWeight");
  const w = b.ctaWidth ?? 240;
  const fs = b.ctaFontSize ?? 18;
  const py = b.ctaPy ?? 8;
  const px = b.ctaPx ?? 26;
  return (
    `<table role="presentation" border="0" cellspacing="0" cellpadding="0" width="${w}" height="40" style="text-align:center;max-width:${w}px !important;">` +
    `<tr><td align="center" valign="middle" style="text-align:center;vertical-align:middle;height:40px;border-radius:${rad}px;" bgcolor="${bg}">` +
    `<p class="f-primary" style="font-size:${fs}px;line-height:100%;color:${col};font-weight:${wt};margin:0;">` +
    `<a href="${b.ctaUrl || "#"}" target="_blank" class="f-primary" style="text-decoration:none;display:block;color:${col} !important;padding:${py}px ${px}px;font-size:${fs}px;line-height:100%;">` +
    `<span style="color:${col} !important;text-transform:${tr};">${b.ctaText || "My CTA"}</span>` +
    `</a></p></td></tr></table>`
  );
}

/** Unique ID for new blocks/snippets. */
export function newId() {
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/** Deep clone via JSON (sufficient for our plain-data structures). */
export function clone(v) {
  return JSON.parse(JSON.stringify(v));
}
