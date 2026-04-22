import { Plus, Calendar, BookOpen, Zap } from "lucide-react";
import { BUILTIN_SNIPPETS } from "./builtin.jsx";

export const TEMPLATES = {
  blank: { name: "Blank", icon: Plus, blocks: [] },
  matchday: {
    name: "Match Day",
    icon: Calendar,
    blocks: [
      { snippet: "generic_header", data: BUILTIN_SNIPPETS.generic_header.defaults() },
      { snippet: "hero_image", data: BUILTIN_SNIPPETS.hero_image.defaults() },
      {
        snippet: "headline_body_cta",
        data: {
          ...BUILTIN_SNIPPETS.headline_body_cta.defaults(),
          headline: "MATCHDAY IS HERE",
          body: "Come support the team this weekend. Tickets still available.",
        },
      },
      { snippet: "schedule_dates", data: BUILTIN_SNIPPETS.schedule_dates.defaults() },
      { snippet: "golden_line", data: BUILTIN_SNIPPETS.golden_line.defaults() },
      { snippet: "three_col_img", data: BUILTIN_SNIPPETS.three_col_img.defaults() },
    ],
  },
  newsletter: {
    name: "Newsletter",
    icon: BookOpen,
    blocks: [
      { snippet: "generic_header", data: BUILTIN_SNIPPETS.generic_header.defaults() },
      { snippet: "hero_image", data: BUILTIN_SNIPPETS.hero_image.defaults() },
      {
        snippet: "headline_subtitle",
        data: {
          ...BUILTIN_SNIPPETS.headline_subtitle.defaults(),
          headline: "THIS WEEK",
          subtitle: "Stories from the team",
        },
      },
      { snippet: "two_col_full", data: BUILTIN_SNIPPETS.two_col_full.defaults() },
      { snippet: "invert_2_col_full", data: BUILTIN_SNIPPETS.invert_2_col_full.defaults() },
      { snippet: "three_col_img_content", data: BUILTIN_SNIPPETS.three_col_img_content.defaults() },
    ],
  },
  promo: {
    name: "Promotional",
    icon: Zap,
    blocks: [
      { snippet: "hero_image", data: BUILTIN_SNIPPETS.hero_image.defaults() },
      {
        snippet: "headline_body_cta",
        data: { ...BUILTIN_SNIPPETS.headline_body_cta.defaults(), headline: "LIMITED-TIME OFFER" },
      },
      { snippet: "promo_code", data: BUILTIN_SNIPPETS.promo_code.defaults() },
      { snippet: "banner", data: BUILTIN_SNIPPETS.banner.defaults() },
    ],
  },
};
