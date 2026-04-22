import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { ctaPreviewStyle } from "../lib/tokens.jsx";

export function CTAPreview({ b, t, align = "center" }) {
  return (
    <div style={{ textAlign: align }}>
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        style={ctaPreviewStyle(b, t)}
      >
        {b.ctaText || "My CTA"}
      </a>
    </div>
  );
}

export function EmptyMedia({ label = "Image", small = false, thin = false }) {
  const padding = thin ? "32px 16px" : small ? "32px 16px" : "56px 16px";
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, rgba(148,163,184,0.15), rgba(148,163,184,0.08))",
        border: "1.5px dashed rgba(100,116,139,0.35)",
        borderRadius: 8,
        padding,
        textAlign: "center",
        color: "#64748b",
        fontSize: 11,
        fontWeight: 500,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <ImageIcon size={small ? 18 : 24} strokeWidth={1.5} />
      {!small && <span>{label}</span>}
    </div>
  );
}
