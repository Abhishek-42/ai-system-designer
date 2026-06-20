import {
  addBackground,
  addBody,
  addChrome,
  addFooter,
  addKicker,
  addPanel,
  addTag,
  addTitle,
  colors,
} from "./theme.mjs";

export async function slide05(presentation, ctx) {
  const slide = presentation.slides.add();
  addBackground(ctx, slide);
  addChrome(ctx, slide, "TECH");
  addKicker(ctx, slide, "TECH USED");
  addTitle(ctx, slide, "The technology stack stays simple and supports the product without becoming the main story.", {
    width: 860,
    height: 92,
  });

  addBody(ctx, slide, "This slide keeps the technology overview short and readable for presentation purposes.", {
    y: 220,
    width: 430,
    height: 54,
    fontSize: 17,
    color: colors.textSecondary,
  });

  addPanel(ctx, slide, {
    x: 132,
    y: 296,
    width: 1020,
    height: 78,
    eyebrow: "FRONTEND LAYER",
    title: "Vite + JavaScript + Cytoscape",
    body: "Used to create the interface and the interactive diagram canvas.",
    bodySize: 15,
    name: "tech-layer-1",
  });

  addPanel(ctx, slide, {
    x: 182,
    y: 394,
    width: 920,
    height: 78,
    eyebrow: "BACKEND LAYER",
    title: "FastAPI",
    body: "Handles application logic, validated operations, and communication with the interface.",
    bodySize: 15,
    name: "tech-layer-2",
  });

  addPanel(ctx, slide, {
    x: 232,
    y: 492,
    width: 820,
    height: 78,
    eyebrow: "AI + STORAGE",
    title: "Groq + JSON design state",
    body: "Groq supports the architecture chat, while a JSON document stores the diagram structure.",
    bodySize: 15,
    name: "tech-layer-3",
  });

  addTag(ctx, slide, {
    x: 990,
    y: 222,
    width: 130,
    text: "LIGHT OVERVIEW",
    fill: colors.bgSoft,
    line: colors.lineSubtle,
    color: colors.textPrimary,
    name: "tech-tag",
  });

  addFooter(ctx, slide);
  return slide;
}
