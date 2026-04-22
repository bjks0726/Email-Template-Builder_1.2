import React from "react";
import {
  AlignCenter, AlignLeft, Type as TypeIcon, Tag, Image as ImageIcon,
  Flag, Minus, MoveVertical, Columns2, Columns3, Grid3x3, Calendar,
  Layers, ArrowLeftRight, Heading1,
} from "lucide-react";
import {
  headlineStyle, headlineCSS, bodyStyle, bodyCSS, padCss, ctaHTML,
} from "../lib/tokens.jsx";
import { CTAPreview, EmptyMedia } from "../components/SnippetHelpers.jsx";

// Each snippet has:
//   id, label, category, icon   — metadata
//   defaults()                  — initial data when added to canvas
//   Preview({ b, t })           — React component for canvas preview
//   toHTML(b, t)                — email-safe table HTML for export
//   props                       — array of property groups to show in editor
//                                 ("content", "typography", "cta", "image",
//                                  "layout", "spacing", "divider", "spacer",
//                                  "twinCta", "twoDates", "threeCol",
//                                  "threeColSimple")

export const BUILTIN_SNIPPETS = {
  headline_body_cta: {
    id: "headline_body_cta",
    label: "Headline + Body + CTA",
    category: "Hero",
    icon: AlignCenter,
    defaults: () => ({
      headline: "Lorem ipsum dolor sit",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras malesuada.",
      ctaText: "My CTA",
      ctaUrl: "#",
      align: "center",
      pt: 8, pr: 24, pb: 12, pl: 24,
    }),
    Preview: ({ b, t }) => (
      <div style={{ padding: `${b.pt ?? 8}px ${b.pr ?? 24}px ${b.pb ?? 12}px ${b.pl ?? 24}px`, fontFamily: t.fontStack }}>
        <div style={{ padding: 12 }}>
          <h1 style={headlineStyle({ ...b, headlineAlign: b.align }, t, "h1")}>{b.headline}</h1>
        </div>
        <div style={{ padding: "0 0 20px" }}>
          <p style={bodyStyle({ ...b, bodyAlign: b.align }, t)}>{b.body}</p>
        </div>
        <div style={{ padding: "12px 24px 36px" }}>
          <CTAPreview b={b} t={t} align={b.align} />
        </div>
      </div>
    ),
    toHTML: (b, t) =>
      `<tr><td align="center" style="${padCss(b, { pt: 8, pr: 24, pb: 12, pl: 24 })}">` +
      `<table role="presentation" class="fullWidth" width="100%" border="0" cellspacing="0" cellpadding="0" align="center">` +
      `<tr><td align="${b.align}" style="padding:12px;"><h1 style="${headlineCSS({ ...b, headlineAlign: b.align }, t, "h1")}" class="f-primary">${b.headline}</h1></td></tr>` +
      `<tr><td class="f-primary" style="padding:0 0 20px;${bodyCSS({ ...b, bodyAlign: b.align }, t)}">${b.body}</td></tr>` +
      `<tr><td align="${b.align}" style="padding:12px 24px 36px;">${ctaHTML(b, t)}</td></tr>` +
      `</table></td></tr>`,
    props: ["content", "typography", "cta", "spacing"],
  },

  headline_body_cta_left: {
    id: "headline_body_cta_left",
    label: "Headline + Body + CTA (Left)",
    category: "Hero",
    icon: AlignLeft,
    defaults: () => ({
      headline: "Lorem ipsum dolor sit",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      ctaText: "My CTA",
      ctaUrl: "#",
      align: "left",
      pt: 8, pr: 24, pb: 12, pl: 24,
    }),
    Preview: ({ b, t }) => (
      <div style={{ padding: `${b.pt ?? 8}px ${b.pr ?? 24}px ${b.pb ?? 12}px ${b.pl ?? 24}px`, fontFamily: t.fontStack }}>
        <div style={{ padding: 12 }}>
          <h1 style={headlineStyle({ ...b, headlineAlign: "left" }, t, "h1")}>{b.headline}</h1>
        </div>
        <div style={{ padding: "0 0 20px" }}>
          <p style={bodyStyle({ ...b, bodyAlign: "left" }, t)}>{b.body}</p>
        </div>
        <div style={{ padding: "12px 0 36px" }}>
          <CTAPreview b={b} t={t} align="left" />
        </div>
      </div>
    ),
    toHTML: (b, t) => BUILTIN_SNIPPETS.headline_body_cta.toHTML({ ...b, align: "left" }, t),
    props: ["content", "typography", "cta", "spacing"],
  },

  headline_subtitle: {
    id: "headline_subtitle",
    label: "Headline + Subtitle + Body",
    category: "Hero",
    icon: TypeIcon,
    defaults: () => ({
      headline: "Lorem ipsum dolor sit",
      subtitle: "Subtitle goes here",
      body: "Lorem ipsum dolor sit amet.",
      pt: 0, pr: 24, pb: 12, pl: 24,
    }),
    Preview: ({ b, t }) => (
      <div style={{ padding: `${b.pt ?? 0}px ${b.pr ?? 24}px ${b.pb ?? 12}px ${b.pl ?? 24}px`, fontFamily: t.fontStack }}>
        <div style={{ padding: "12px 0" }}><h1 style={headlineStyle(b, t, "h1")}>{b.headline}</h1></div>
        <div style={{ padding: 12 }}><h2 style={headlineStyle(b, t, "h2")}>{b.subtitle}</h2></div>
        <div style={{ padding: "12px 0" }}><p style={bodyStyle(b, t)}>{b.body}</p></div>
      </div>
    ),
    toHTML: (b, t) =>
      `<tr><td align="center" style="${padCss(b, { pr: 24, pb: 12, pl: 24 })}">` +
      `<table role="presentation" class="fullWidth" width="100%" border="0" cellspacing="0" cellpadding="0" align="center">` +
      `<tr><td align="center" style="padding:12px 0;"><h1 style="${headlineCSS(b, t, "h1")}" class="f-primary">${b.headline}</h1></td></tr>` +
      `<tr><td align="center" style="padding:12px 0;"><h2 style="${headlineCSS(b, t, "h2")}" class="f-primary">${b.subtitle}</h2></td></tr>` +
      `<tr><td class="f-primary" style="padding:12px 0;${bodyCSS(b, t)}">${b.body}</td></tr>` +
      `</table></td></tr>`,
    props: ["content", "typography", "spacing"],
  },

  promo_code: {
    id: "promo_code",
    label: "Promo Code",
    category: "Hero",
    icon: Tag,
    defaults: () => ({
      body: "Lorem ipsum dolor sit amet.",
      code: "PROMO25",
      codeLetterSpacing: 2,
      pt: 0, pr: 24, pb: 12, pl: 24,
    }),
    Preview: ({ b, t }) => (
      <div style={{ padding: `${b.pt ?? 0}px ${b.pr ?? 24}px ${b.pb ?? 12}px ${b.pl ?? 24}px`, fontFamily: t.fontStack }}>
        <div style={{ padding: "24px 0 0" }}><p style={bodyStyle(b, t)}>{b.body}</p></div>
        <div style={{ padding: 12 }}>
          <h1 style={{ ...headlineStyle(b, t, "h1"), color: b.headlineColor ?? t.accent, letterSpacing: b.codeLetterSpacing }}>
            {b.code}
          </h1>
        </div>
      </div>
    ),
    toHTML: (b, t) =>
      `<tr><td align="center" style="${padCss(b, { pr: 24, pb: 12, pl: 24 })}">` +
      `<table role="presentation" class="fullWidth" width="100%" border="0" cellspacing="0" cellpadding="0" align="center">` +
      `<tr><td class="f-primary" style="padding:24px 0 0;${bodyCSS(b, t)}">${b.body}</td></tr>` +
      `<tr><td align="center" style="padding:12px;"><h1 style="${headlineCSS({ ...b, headlineColor: b.headlineColor ?? t.accent }, t, "h1")};letter-spacing:${b.codeLetterSpacing}px;" class="f-primary">${b.code}</h1></td></tr>` +
      `</table></td></tr>`,
    props: ["content", "typography", "spacing"],
  },

  hero_image: {
    id: "hero_image",
    label: "Hero Image",
    category: "Media",
    icon: ImageIcon,
    defaults: () => ({
      src: "", alt: "", link: "#",
      width: 100, imgRadius: 0, borderWidth: 0, borderColor: "#000000",
      align: "center",
      pt: 0, pr: 0, pb: 0, pl: 0,
    }),
    Preview: ({ b }) => (
      <div style={{ textAlign: b.align ?? "center", padding: `${b.pt ?? 0}px ${b.pr ?? 0}px ${b.pb ?? 0}px ${b.pl ?? 0}px` }}>
        {b.src ? (
          <img
            src={b.src}
            alt={b.alt}
            style={{
              width: `${b.width ?? 100}%`,
              display: "inline-block",
              borderRadius: b.imgRadius,
              border: b.borderWidth ? `${b.borderWidth}px solid ${b.borderColor}` : "none",
              maxWidth: "100%",
            }}
          />
        ) : (
          <EmptyMedia label={`Hero · ${b.width ?? 100}% width`} />
        )}
      </div>
    ),
    toHTML: (b) =>
      `<tr><td align="${b.align ?? "center"}" style="${padCss(b)}">` +
      `<a href="${b.link}" class="f-primary" style="margin:0;padding:0;">` +
      `<img src="${b.src || "http://dummyimage.com/1392x800"}" alt="${b.alt}" width="${Math.round(648 * ((b.width ?? 100) / 100))}" class="fullWidth" style="display:block;border:${b.borderWidth ? `${b.borderWidth}px solid ${b.borderColor}` : "none"};margin:0 auto;border-radius:${b.imgRadius}px;"/>` +
      `</a></td></tr>`,
    props: ["image", "spacing"],
  },

  banner: {
    id: "banner",
    label: "Banner",
    category: "Media",
    icon: Flag,
    defaults: () => ({
      src: "", alt: "", link: "#",
      width: 100, imgRadius: 0, borderWidth: 0, borderColor: "#000000",
      align: "center",
      pt: 0, pr: 0, pb: 0, pl: 0,
    }),
    Preview: ({ b }) => (
      <div style={{ textAlign: b.align ?? "center", padding: `${b.pt ?? 0}px ${b.pr ?? 0}px ${b.pb ?? 0}px ${b.pl ?? 0}px` }}>
        {b.src ? (
          <img
            src={b.src}
            alt={b.alt}
            style={{
              width: `${b.width ?? 100}%`,
              display: "inline-block",
              borderRadius: b.imgRadius,
              border: b.borderWidth ? `${b.borderWidth}px solid ${b.borderColor}` : "none",
            }}
          />
        ) : (
          <EmptyMedia label="Banner" thin />
        )}
      </div>
    ),
    toHTML: (b) =>
      `<tr><td align="${b.align ?? "center"}" class="mobile_padding-lr-24" style="${padCss(b)}">` +
      `<a href="${b.link}" class="f-primary" style="margin:0;padding:0;">` +
      `<img src="${b.src || "http://dummyimage.com/1392x360"}" alt="${b.alt}" width="${Math.round(648 * ((b.width ?? 100) / 100))}" class="fullWidth" style="display:block;border:${b.borderWidth ? `${b.borderWidth}px solid ${b.borderColor}` : "none"};border-radius:${b.imgRadius}px;"/>` +
      `</a></td></tr>`,
    props: ["image", "spacing"],
  },

  generic_header: {
    id: "generic_header",
    label: "Generic Header (Logo + Nav)",
    category: "Header/Footer",
    icon: Heading1,
    defaults: () => ({
      logoSrc: "",
      logoAlt: "Logo",
      logoLink: "#",
      logoWidth: 696,
      showNav: true,
      navItems: [
        { label: "Schedule", url: "#" },
        { label: "Tickets", url: "#" },
        { label: "Team Store", url: "#" },
        { label: "Youth Soccer", url: "#" },
      ],
      showDividers: true,
      pt: 0, pr: 0, pb: 0, pl: 0,
    }),
    Preview: ({ b, t }) => (
      <div style={{ padding: `${b.pt}px ${b.pr}px ${b.pb}px ${b.pl}px`, fontFamily: t.fontStack }}>
        <div style={{ textAlign: "center" }}>
          {b.logoSrc ? (
            <img src={b.logoSrc} alt={b.logoAlt} style={{ width: "100%", maxWidth: b.logoWidth, display: "block" }} />
          ) : (
            <EmptyMedia label="Logo / header image" thin />
          )}
        </div>
        {b.showDividers && <div style={{ borderBottom: `4px solid ${t.divider}`, margin: "12px 24px 6px" }} />}
        {b.showNav && (
          <div style={{ padding: "6px 20px", display: "flex", justifyContent: "center", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            {b.navItems.map((n, i) => (
              <React.Fragment key={i}>
                <a href="#" onClick={(e) => e.preventDefault()} style={{ color: t.textDark, textDecoration: "none", fontWeight: 700, fontSize: 14, textTransform: "uppercase" }}>{n.label}</a>
                {i < b.navItems.length - 1 && <span style={{ color: t.textDark }}>|</span>}
              </React.Fragment>
            ))}
          </div>
        )}
        {b.showDividers && <div style={{ borderBottom: `4px solid ${t.divider}`, margin: "6px 24px" }} />}
      </div>
    ),
    toHTML: (b, t) => {
      const logoCell = `<tr><td align="center" class="mobile_padding-b-24"><a href="${b.logoLink}"><img title="" src="${b.logoSrc || "http://dummyimage.com/1392x280"}" alt="${b.logoAlt}" width="${b.logoWidth}" height="auto" class="fullWidth" style="display:block;border:none;"/></a></td></tr>`;
      const divider = b.showDividers
        ? `<tr><td align="center" style="padding:12px 24px 6px;" class="mobile_padding-full-0"><table align="center" border="0" cellpadding="0" cellspacing="0" width="648" class="fullWidth"><tr><td height="3" style="border-bottom:4px solid ${t.divider};font-size:1px;line-height:1px;" width="100%">&nbsp;</td></tr></table></td></tr>`
        : "";
      const navCell = b.showNav
        ? `<tr><td align="center" style="padding:0 20px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="width:100%;max-width:648px;" class="fullWidth"><tr>` +
          b.navItems
            .map(
              (n, i) =>
                `<td align="center"><a href="${n.url}" class="f-primary" style="color:${t.textDark};text-decoration:none;font-weight:700;font-size:14px;text-transform:uppercase;">${n.label}</a></td>` +
                (i < b.navItems.length - 1 ? `<td align="center" width="10" class="f-primary" style="color:${t.textDark};">|</td>` : ""),
            )
            .join("") +
          `</tr></table></td></tr>`
        : "";
      return (
        `<tr><td align="center" style="${padCss(b)}">` +
        `<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">` +
        logoCell +
        divider +
        navCell +
        divider +
        `</table></td></tr>`
      );
    },
    props: ["header", "spacing"],
  },

  golden_line: {
    id: "golden_line",
    label: "Divider Line",
    category: "Layout",
    icon: Minus,
    defaults: () => ({ thickness: 4, pt: 12, pr: 24, pb: 6, pl: 24 }),
    Preview: ({ b, t }) => (
      <div style={{ padding: `${b.pt}px ${b.pr}px ${b.pb}px ${b.pl}px` }}>
        <div style={{ borderBottom: `${b.thickness}px solid ${b.dividerColor ?? t.divider}`, width: "100%" }} />
      </div>
    ),
    toHTML: (b, t) =>
      `<tr><td align="center" style="${padCss(b)}" class="mobile_padding-full-0">` +
      `<table align="center" border="0" cellpadding="0" cellspacing="0" width="648" class="fullWidth">` +
      `<tr><td height="3" style="border-bottom:${b.thickness}px solid ${b.dividerColor ?? t.divider};font-size:1px;line-height:1px;" width="100%">&nbsp;</td></tr>` +
      `</table></td></tr>`,
    props: ["divider", "spacing"],
  },

  space_row: {
    id: "space_row",
    label: "Spacer",
    category: "Layout",
    icon: MoveVertical,
    defaults: () => ({ height: 24 }),
    Preview: ({ b }) => (
      <div
        style={{
          height: b.height,
          background:
            "repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(0,0,0,0.03) 6px, rgba(0,0,0,0.03) 12px)",
        }}
      />
    ),
    toHTML: (b) => `<tr><td height="${b.height}" style="font-size:1px;line-height:1px;">&nbsp;</td></tr>`,
    props: ["spacer"],
  },

  two_col_cta: {
    id: "two_col_cta",
    label: "2 Columns: Twin CTAs",
    category: "Columns",
    icon: Columns2,
    defaults: () => ({ cta1Text: "My CTA", cta1Url: "#", cta2Text: "My CTA", cta2Url: "#", pt: 12, pr: 24, pb: 12, pl: 24 }),
    Preview: ({ b, t, device }) => (
      <div style={{ padding: `${b.pt}px ${b.pr}px ${b.pb}px ${b.pl}px`, display: "flex", flexDirection: device === "mobile" ? "column" : "row", gap: device === "mobile" ? 12 : 24 }}>
        <div style={{ flex: 1, textAlign: "center" }}><CTAPreview b={{ ...b, ctaText: b.cta1Text }} t={t} /></div>
        <div style={{ flex: 1, textAlign: "center" }}><CTAPreview b={{ ...b, ctaText: b.cta2Text }} t={t} /></div>
      </div>
    ),
    toHTML: (b, t) =>
      `<tr><td align="center" style="${padCss(b)}">` +
      `<table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" width="648" class="fullWidth"><tr>` +
      `<td align="left" class="mobStacking" width="324"><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="100%"><tr><td align="center">${ctaHTML({ ...b, ctaText: b.cta1Text, ctaUrl: b.cta1Url }, t)}</td></tr></table></td>` +
      `<td align="left" class="mobStacking" width="324"><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="100%"><tr><td align="center">${ctaHTML({ ...b, ctaText: b.cta2Text, ctaUrl: b.cta2Url }, t)}</td></tr></table></td>` +
      `</tr></table></td></tr>`,
    props: ["twinCta", "cta", "spacing"],
  },

  two_col_full_content: {
    id: "two_col_full_content",
    label: "2 Columns: Twin Text",
    category: "Columns",
    icon: Columns2,
    defaults: () => ({
      text1: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      text2: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      pt: 12, pr: 24, pb: 12, pl: 24,
    }),
    Preview: ({ b, t, device }) => (
      <div style={{ padding: `${b.pt}px ${b.pr}px ${b.pb}px ${b.pl}px`, display: "flex", flexDirection: device === "mobile" ? "column" : "row", gap: device === "mobile" ? 12 : 24, fontFamily: t.fontStack }}>
        <div style={{ flex: 1 }}><p style={bodyStyle({ ...b, bodyAlign: "left" }, t)}>{b.text1}</p></div>
        <div style={{ flex: 1 }}><p style={bodyStyle({ ...b, bodyAlign: "left" }, t)}>{b.text2}</p></div>
      </div>
    ),
    toHTML: (b, t) =>
      `<tr><td align="center" style="${padCss(b)}">` +
      `<table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" width="648" class="fullWidth"><tr>` +
      `<td align="left" class="mobStacking f-primary" width="312" valign="top" style="${bodyCSS({ ...b, bodyAlign: "left" }, t)};padding:6px 0;">${b.text1}</td>` +
      `<td width="24" class="mobilehidded">&nbsp;</td>` +
      `<td align="left" class="mobStacking f-primary" width="312" valign="top" style="${bodyCSS({ ...b, bodyAlign: "left" }, t)};padding:6px 0;">${b.text2}</td>` +
      `</tr></table></td></tr>`,
    props: ["twinText", "typography", "spacing"],
  },

  two_col_headline_content: {
    id: "two_col_headline_content",
    label: "2 Columns: Headline + Content",
    category: "Columns",
    icon: Columns2,
    defaults: () => ({
      headline: "Lorem ipsum",
      body: "Lorem ipsum dolor sit amet consectetur.",
      pt: 12, pr: 24, pb: 12, pl: 24,
    }),
    Preview: ({ b, t, device }) => (
      <div style={{ padding: `${b.pt}px ${b.pr}px ${b.pb}px ${b.pl}px`, display: "flex", flexDirection: device === "mobile" ? "column" : "row", gap: 12, fontFamily: t.fontStack, alignItems: "flex-start" }}>
        <div style={{ flex: 1, padding: "12px 24px" }}>
          <h1 style={headlineStyle({ ...b, headlineAlign: "left" }, t, "h1")}>{b.headline}</h1>
        </div>
        <div style={{ flex: 1, padding: "6px 12px" }}>
          <p style={bodyStyle({ ...b, bodyAlign: "left" }, t)}>{b.body}</p>
        </div>
      </div>
    ),
    toHTML: (b, t) =>
      `<tr><td align="center" style="${padCss(b)}">` +
      `<table role="presentation" class="fullWidth" width="100%" border="0" cellspacing="0" cellpadding="0" align="center"><tr>` +
      `<td align="left" style="padding:12px 24px;" class="mobStacking hlalign_center mobile_padding-full-0"><h1 style="${headlineCSS({ ...b, headlineAlign: "left" }, t, "h1")}" class="f-primary">${b.headline}</h1></td>` +
      `<td align="left" width="324" class="fullWidth mobStacking"><table role="presentation" width="100%" align="center" border="0" cellspacing="0" cellpadding="0"><tr><td valign="top" style="${bodyCSS({ ...b, bodyAlign: "left" }, t)};padding:6px 12px;" class="f-primary">${b.body}</td></tr></table></td>` +
      `</tr></table></td></tr>`,
    props: ["content", "typography", "spacing"],
  },

  two_col_full: {
    id: "two_col_full",
    label: "2 Columns: Image + Content + CTA",
    category: "Columns",
    icon: Columns2,
    defaults: () => ({
      imgSrc: "", imgAlt: "", imgLink: "#",
      headline: "Headline",
      body: "Lorem ipsum dolor sit amet consectetur.",
      ctaText: "My CTA", ctaUrl: "#",
      invert: false,
      imgWidth: 100, imgRadius: 0,
      pt: 12, pr: 24, pb: 12, pl: 24,
    }),
    Preview: ({ b, t, device }) => {
      const Img = (
        <div style={{ flex: 1 }}>
          {b.imgSrc ? (
            <img
              src={b.imgSrc}
              alt={b.imgAlt}
              style={{ width: `${b.imgWidth ?? 100}%`, display: "block", borderRadius: b.imgRadius }}
            />
          ) : (
            <EmptyMedia small />
          )}
        </div>
      );
      const Content = (
        <div style={{ flex: 1, fontFamily: t.fontStack }}>
          <h2 style={headlineStyle({ ...b, headlineAlign: "left" }, t, "h2")}>{b.headline}</h2>
          <div style={{ padding: "6px 0" }}><p style={bodyStyle({ ...b, bodyAlign: "left" }, t)}>{b.body}</p></div>
          <CTAPreview b={b} t={t} align="left" />
        </div>
      );
      // On mobile, the .invertcomp {direction:ltr} rule resets the RTL flip so
      // the image ends up on top regardless of desktop invert.
      const isMobile = device === "mobile";
      return (
        <div style={{ padding: `${b.pt}px ${b.pr}px ${b.pb}px ${b.pl}px`, display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 12 : 24, alignItems: "flex-start" }}>
          {isMobile || !b.invert ? <>{Img}{Content}</> : <>{Content}{Img}</>}
        </div>
      );
    },
    toHTML: (b, t) => {
      const w = Math.round(312 * ((b.imgWidth ?? 100) / 100));
      const imgCell = `<td align="${b.invert ? "right" : "left"}" class="mobStacking" width="312"><a href="${b.imgLink}" style="margin:0;padding:0;"><img src="${b.imgSrc || "http://dummyimage.com/1392x800"}" alt="${b.imgAlt}" width="${w}" style="display:block;border:none;margin:0 auto;border-radius:${b.imgRadius}px;" class="fullWidth"/></a></td>`;
      const contentCell =
        `<td align="left" class="mobStacking" width="312"><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="312" class="fullWidth">` +
        `<tr><td valign="top" style="padding-top:2px;padding-left:6px;"><h2 style="${headlineCSS({ ...b, headlineAlign: "left" }, t, "h2")}" class="f-primary">${b.headline}</h2></td></tr>` +
        `<tr><td style="${bodyCSS({ ...b, bodyAlign: "left" }, t)};padding:6px 0 6px 6px;" class="f-primary">${b.body}</td></tr>` +
        `<tr><td align="left">${ctaHTML(b, t)}</td></tr>` +
        `</table></td>`;
      return (
        `<tr><td align="center" style="${padCss(b)}">` +
        `<table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" width="648" class="fullWidth ${b.invert ? "invertcomp" : ""}" ${b.invert ? 'dir="rtl"' : ""}><tr>` +
        imgCell +
        `<td width="24" class="mobilehidded">&nbsp;</td>` +
        contentCell +
        `</tr></table></td></tr>`
      );
    },
    props: ["content", "image", "typography", "cta", "layout", "spacing"],
  },

  invert_2_col_full: {
    id: "invert_2_col_full",
    label: "2 Columns: Text + Image + CTA (Inverted)",
    category: "Columns",
    icon: ArrowLeftRight,
    defaults: () => ({ ...BUILTIN_SNIPPETS.two_col_full.defaults(), invert: true }),
    Preview: (props) => BUILTIN_SNIPPETS.two_col_full.Preview(props),
    toHTML: (b, t) => BUILTIN_SNIPPETS.two_col_full.toHTML({ ...b, invert: true }, t),
    props: ["content", "image", "typography", "cta", "layout", "spacing"],
  },

  three_col_img_content: {
    id: "three_col_img_content",
    label: "3 Columns: Image + Content + CTA",
    category: "Columns",
    icon: Columns3,
    defaults: () => ({
      col1: { src: "", headline: "HEADLINE", body: "Lorem ipsum.", ctaText: "My CTA", ctaUrl: "#" },
      col2: { src: "", headline: "HEADLINE", body: "Lorem ipsum.", ctaText: "My CTA", ctaUrl: "#" },
      col3: { src: "", headline: "HEADLINE", body: "Lorem ipsum.", ctaText: "My CTA", ctaUrl: "#" },
      imgRadius: 0,
      pt: 12, pr: 24, pb: 12, pl: 24,
    }),
    Preview: ({ b, t, device }) => (
      <div style={{ padding: `${b.pt}px ${b.pr}px ${b.pb}px ${b.pl}px`, display: "flex", flexDirection: device === "mobile" ? "column" : "row", gap: device === "mobile" ? 18 : 9, fontFamily: t.fontStack }}>
        {[b.col1, b.col2, b.col3].map((c, i) => (
          <div key={i} style={{ flex: 1 }}>
            {c.src ? (
              <img src={c.src} alt="" style={{ width: "100%", display: "block", borderRadius: b.imgRadius }} />
            ) : (
              <EmptyMedia small />
            )}
            <h3 style={headlineStyle({ ...b, headlineAlign: "left" }, t, "h3")}>{c.headline}</h3>
            <div style={{ padding: "6px 0 12px" }}>
              <p style={{ ...bodyStyle({ bodyAlign: "left" }, t), fontSize: (b.bodySize ?? t.bodySize) - 2 }}>{c.body}</p>
            </div>
            <CTAPreview b={{ ...b, ctaText: c.ctaText }} t={t} align="left" />
          </div>
        ))}
      </div>
    ),
    toHTML: (b, t) => {
      const col = (c) =>
        `<td align="left" class="mobStacking" width="210"><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="100%">` +
        `<tr><td align="center"><img src="${c.src || "http://dummyimage.com/1392x800"}" alt="" width="210" class="m300width" style="display:block;border:none;margin:0 auto;border-radius:${b.imgRadius}px;"/></td></tr>` +
        `<tr><td style="padding-top:6px;padding-left:6px;"><h3 style="${headlineCSS({ ...b, headlineAlign: "left" }, t, "h3")}" class="f-primary">${c.headline}</h3></td></tr>` +
        `<tr><td style="${bodyCSS({ ...b, bodyAlign: "left" }, t)};padding:6px 0 12px 6px;" class="f-primary">${c.body}</td></tr>` +
        `<tr><td align="left">${ctaHTML({ ...b, ctaText: c.ctaText, ctaUrl: c.ctaUrl }, t)}</td></tr>` +
        `</table></td>`;
      return (
        `<tr><td align="center" style="${padCss(b)}">` +
        `<table role="presentation" class="fullWidth" width="648" border="0" cellspacing="0" cellpadding="0" align="center"><tr>` +
        col(b.col1) +
        `<td width="9" class="mobilehidded">&nbsp;</td>` +
        col(b.col2) +
        `<td width="9" class="mobilehidded">&nbsp;</td>` +
        col(b.col3) +
        `</tr></table></td></tr>`
      );
    },
    props: ["threeCol", "typography", "cta", "image", "spacing"],
  },

  three_col_img: {
    id: "three_col_img",
    label: "3 Columns: Image + Headline (dark)",
    category: "Columns",
    icon: Grid3x3,
    defaults: () => ({
      col1: { src: "", headline: "HEADLINE" },
      col2: { src: "", headline: "HEADLINE" },
      col3: { src: "", headline: "HEADLINE" },
      imgRadius: 0,
      pt: 24, pr: 24, pb: 24, pl: 24,
    }),
    Preview: ({ b, t, device }) => (
      <div style={{ padding: `${b.pt}px ${b.pr}px ${b.pb}px ${b.pl}px`, backgroundColor: t.footerBg, display: "flex", flexDirection: device === "mobile" ? "column" : "row", gap: device === "mobile" ? 18 : 9, fontFamily: t.fontStack }}>
        {[b.col1, b.col2, b.col3].map((c, i) => (
          <div key={i} style={{ flex: 1 }}>
            {c.src ? (
              <img src={c.src} alt="" style={{ width: "100%", display: "block", border: "1px solid #4D4949", borderRadius: b.imgRadius }} />
            ) : (
              <div style={{ border: "1px solid #4D4949", color: "#aaa", padding: "24px 0", textAlign: "center", fontSize: 10 }}>IMG</div>
            )}
            <h3 style={{ ...headlineStyle({ ...b, headlineAlign: "left" }, t, "h3"), color: b.headlineColor ?? t.accent }}>{c.headline}</h3>
          </div>
        ))}
      </div>
    ),
    toHTML: (b, t) => {
      const col = (c) =>
        `<td align="left" class="mobStacking" width="210"><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="100%">` +
        `<tr><td align="center"><img src="${c.src || "http://dummyimage.com/1392x800"}" alt="" width="210" class="m300width" style="display:block;margin:0 auto;border:solid 1px #4D4949;border-radius:${b.imgRadius}px;"/></td></tr>` +
        `<tr><td style="padding-top:6px;padding-left:6px;"><h3 style="${headlineCSS({ ...b, headlineAlign: "left", headlineColor: b.headlineColor ?? t.accent }, t, "h3")}" class="f-primary">${c.headline}</h3></td></tr>` +
        `</table></td>`;
      return (
        `<tr><td align="center" style="${padCss(b)};background-color:${t.footerBg};" bgcolor="${t.footerBg}">` +
        `<table role="presentation" class="fullWidth" width="648" border="0" cellspacing="0" cellpadding="0" align="center"><tr>` +
        col(b.col1) +
        `<td width="9" class="mobilehidded">&nbsp;</td>` +
        col(b.col2) +
        `<td width="9" class="mobilehidded">&nbsp;</td>` +
        col(b.col3) +
        `</tr></table></td></tr>`
      );
    },
    props: ["threeColSimple", "typography", "image", "spacing"],
  },

  schedule_dates: {
    id: "schedule_dates",
    label: "Schedule Dates",
    category: "Special",
    icon: Calendar,
    defaults: () => ({
      date1: { day: "24", month: "JUL", title: "Team vs Team", subtitle: "Wed @ 7:30 pm | 2025", ctaText: "My CTA", ctaUrl: "#" },
      date2: { day: "24", month: "JUL", title: "Team vs Team", subtitle: "Wed @ 7:30 pm | 2025", ctaText: "My CTA", ctaUrl: "#" },
      cardBg: "#dcdcdc",
      pt: 12, pr: 24, pb: 12, pl: 24,
    }),
    Preview: ({ b, t, device }) => (
      <div style={{ padding: `${b.pt}px ${b.pr}px ${b.pb}px ${b.pl}px`, display: "flex", flexDirection: device === "mobile" ? "column" : "row", gap: device === "mobile" ? 12 : 24, fontFamily: t.fontStack }}>
        {[b.date1, b.date2].map((d, i) => (
          <div key={i} style={{ flex: 1, backgroundColor: b.cardBg, padding: 6, display: "flex", gap: 9 }}>
            <div style={{ width: 68, backgroundColor: t.accent, color: t.textLight, textAlign: "center", padding: "8px 0" }}>
              <div style={{ fontSize: 24, fontWeight: 800, lineHeight: "28px" }}>{d.day}</div>
              <div style={{ fontSize: 16, padding: "6px 0" }}>{d.month}</div>
            </div>
            <div style={{ flex: 1, color: t.bodyColor }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{d.title}</div>
              <div style={{ fontSize: 12, marginTop: 2 }}>{d.subtitle}</div>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{ fontSize: 14, fontWeight: 700, color: t.accent, textDecoration: "underline", marginTop: 4, display: "inline-block" }}
              >
                {d.ctaText}
              </a>
            </div>
          </div>
        ))}
      </div>
    ),
    toHTML: (b, t) => {
      const card = (d) =>
        `<td align="left" class="mobStacking" width="312"><table role="presentation" width="265" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="${b.cardBg}">` +
        `<tr><td align="left" width="68" style="padding:6px;"><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="68" bgcolor="${t.accent}" height="50">` +
        `<tr><td valign="top" align="center" style="padding-top:8px;"><h1 class="f-primary" style="margin:0;font-size:24px;line-height:28px;font-weight:bold;text-align:center;color:${t.textLight};text-transform:uppercase;">${d.day}</h1></td></tr>` +
        `<tr><td valign="top" align="center" class="f-primary" style="font-size:16px;line-height:20px;text-align:center;color:${t.textLight};padding:6px 0;">${d.month}</td></tr>` +
        `</table></td><td width="9">&nbsp;</td>` +
        `<td align="left" width="179"><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="100%">` +
        `<tr><td valign="top" style="font-size:14px;line-height:16px;font-weight:bold;text-align:left;color:${t.bodyColor};" class="f-primary">${d.title}</td></tr>` +
        `<tr><td valign="top" style="font-size:12px;line-height:14px;text-align:left;color:${t.bodyColor};" class="f-primary">${d.subtitle}</td></tr>` +
        `<tr><td valign="top" style="font-size:14px;line-height:16px;text-align:left;color:${t.bodyColor};padding-top:6px;" class="f-primary"><a href="${d.ctaUrl}" target="_blank" style="color:${t.accent};font-weight:bold;text-decoration:underline;">${d.ctaText}</a></td></tr>` +
        `</table></td></tr></table></td>`;
      return (
        `<tr><td align="center" style="${padCss(b)}">` +
        `<table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" width="648" class="fullWidth"><tr>` +
        card(b.date1) +
        `<td width="24" class="mobilehidded">&nbsp;</td>` +
        card(b.date2) +
        `</tr></table></td></tr>`
      );
    },
    props: ["twoDates", "spacing"],
  },

  full_secondary: {
    id: "full_secondary",
    label: "Full Section (Image+Content+CTA)",
    category: "Hero",
    icon: Layers,
    defaults: () => ({
      imgSrc: "", imgAlt: "", imgLink: "#",
      headline: "Lorem ipsum dolor sit amet",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      ctaText: "My CTA", ctaUrl: "#",
      imgWidth: 100, imgRadius: 0,
      pt: 12, pr: 24, pb: 12, pl: 24,
    }),
    Preview: ({ b, t }) => (
      <div style={{ padding: `${b.pt}px ${b.pr}px ${b.pb}px ${b.pl}px`, fontFamily: t.fontStack }}>
        <div style={{ padding: "12px 0" }}>
          {b.imgSrc ? (
            <img
              src={b.imgSrc}
              alt={b.imgAlt}
              style={{ width: `${b.imgWidth}%`, display: "block", margin: "0 auto", borderRadius: b.imgRadius }}
            />
          ) : (
            <EmptyMedia label="Full section image" />
          )}
        </div>
        <div style={{ padding: "12px 0" }}><h1 style={headlineStyle(b, t, "h1")}>{b.headline}</h1></div>
        <div style={{ padding: "12px 24px" }}><p style={bodyStyle(b, t)}>{b.body}</p></div>
        <div style={{ padding: "12px 24px 0" }}><CTAPreview b={b} t={t} /></div>
      </div>
    ),
    toHTML: (b, t) =>
      `<tr><td align="center" style="${padCss(b)}">` +
      `<table role="presentation" width="100%" align="center" border="0" cellspacing="0" cellpadding="0">` +
      `<tr><td align="center" style="padding:12px 0;"><a href="${b.imgLink}" style="margin:0;padding:0;"><img src="${b.imgSrc || "http://dummyimage.com/1392x800"}" alt="${b.imgAlt}" width="${Math.round(648 * ((b.imgWidth ?? 100) / 100))}" class="fullWidth" style="display:block;border:none;margin:0 auto;border-radius:${b.imgRadius}px;"/></a></td></tr>` +
      `<tr><td style="padding:12px 0;"><h1 style="${headlineCSS(b, t, "h1")}" class="f-primary">${b.headline}</h1></td></tr>` +
      `<tr><td style="padding:12px 24px;"><p class="f-primary" style="${bodyCSS(b, t)}">${b.body}</p></td></tr>` +
      `<tr><td align="center" style="padding:12px 24px 0;">${ctaHTML(b, t)}</td></tr>` +
      `</table></td></tr>`,
    props: ["content", "image", "typography", "cta", "spacing"],
  },
};
