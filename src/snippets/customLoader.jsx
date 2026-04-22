import React from "react";
import { Box } from "lucide-react";

// A "custom snippet" is authored in the Dev → Snippet Studio page as:
//
//   {
//     id, label, category, icon: "Box",
//     fields: [{ key, label, type, default, placeholder?, group?, rows?, min?, max? }],
//     htmlTemplate: `<tr><td style="color:{{headlineColor|h1Color}};">{{headline}}</td></tr>`
//   }
//
// Placeholders in htmlTemplate use `{{fieldKey}}` or `{{overrideKey|tokenKey}}`
// which resolves to the block value if set, otherwise the LOB token value.
//
// Supported field types: "text", "textarea", "image", "url", "color",
//                        "number", "select" (with `options`)

// Escape HTML inside a value so content can't break the template output
function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Substitute {{foo}} and {{override|tokenKey}} placeholders.
function substitute(template, b, t) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)(?:\s*\|\s*([a-zA-Z0-9_]+))?\s*\}\}/g, (_m, key, fallbackTokenKey) => {
    const blockValue = b[key];
    if (blockValue !== undefined && blockValue !== "" && blockValue !== null) {
      return escapeHtml(blockValue);
    }
    if (fallbackTokenKey) {
      const tokenValue = t[fallbackTokenKey];
      if (tokenValue !== undefined) return escapeHtml(tokenValue);
    }
    return "";
  });
}

// Turn a dehydrated custom snippet definition into a live registry entry.
export function compileCustomSnippet(def) {
  const defaults = () => {
    const out = {};
    for (const f of def.fields || []) {
      if (f.default !== undefined) out[f.key] = f.default;
    }
    return out;
  };

  const Preview = ({ b, t }) => {
    const html = substitute(def.htmlTemplate || "", b, t);
    // Rendering as a raw table preview; wrap in a dedicated table so tr/td render correctly.
    return (
      <div style={{ fontFamily: t.fontStack }}>
        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          border={0}
          style={{ width: "100%" }}
          dangerouslySetInnerHTML={{ __html: `<tbody>${html}</tbody>` }}
        />
      </div>
    );
  };

  const toHTML = (b, t) => substitute(def.htmlTemplate || "", b, t);

  // Build unique property group for this snippet so the editor knows which fields to show
  const propsGroup = `custom_${def.id}`;

  return {
    id: def.id,
    label: def.label,
    category: def.category || "Custom",
    icon: Box, // always Box for custom; can extend later
    defaults,
    Preview,
    toHTML,
    props: [propsGroup],
    // metadata used by the editor to know this is custom
    _custom: true,
    _fields: def.fields || [],
    _propsGroup: propsGroup,
  };
}

// Compile an array of defs into a registry map keyed by id.
export function compileCustomSnippets(defs) {
  const out = {};
  for (const def of defs || []) {
    try {
      out[def.id] = compileCustomSnippet(def);
    } catch (err) {
      console.error("Failed to compile custom snippet", def.id, err);
    }
  }
  return out;
}

// Stringify a snippet def for export (JSON file contents for GitHub commit).
export function serializeCustomSnippet(def) {
  return JSON.stringify(def, null, 2);
}

// Parse JSON input when importing a snippet file.
export function parseCustomSnippet(jsonText) {
  const obj = JSON.parse(jsonText);
  if (!obj.id || !obj.label) {
    throw new Error("Snippet must have 'id' and 'label'");
  }
  if (!obj.htmlTemplate) {
    throw new Error("Snippet must have 'htmlTemplate'");
  }
  if (!Array.isArray(obj.fields)) {
    throw new Error("Snippet 'fields' must be an array");
  }
  return obj;
}
