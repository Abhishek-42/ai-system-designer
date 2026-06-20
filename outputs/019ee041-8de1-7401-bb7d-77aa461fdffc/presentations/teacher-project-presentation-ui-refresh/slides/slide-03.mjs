import {
  addBackground,
  addChrome,
  addFooter,
  addKicker,
  addPanel,
  addTag,
  addTitle,
  colors,
} from "./theme.mjs";

export async function slide03(presentation, ctx) {
  const slide = presentation.slides.add();
  addBackground(ctx, slide);
  addChrome(ctx, slide, "SOLUTION");
  addKicker(ctx, slide, "PROPOSED SOLUTION");
  addTitle(ctx, slide, "The project solves the problem by combining guided discussion, visual editing, and structured saving.", {
    width: 920,
    height: 92,
  });

  ctx.addShape(slide, {
    x: 88,
    y: 238,
    width: 1104,
    height: 276,
    fill: colors.bgRich,
    line: ctx.line(colors.lineSubtle, 1),
    name: "solution-shell",
  });

  addPanel(ctx, slide, {
    x: 108,
    y: 272,
    width: 300,
    height: 192,
    eyebrow: "STAGE 1",
    title: "Ask and explore",
    body: "The user describes the project idea, asks architecture questions, and gets guidance inside the chat panel.",
    accent: colors.gold,
    name: "solution-stage-1",
  });

  addPanel(ctx, slide, {
    x: 490,
    y: 272,
    width: 300,
    height: 192,
    eyebrow: "STAGE 2",
    title: "Build visually",
    body: "The canvas lets the user add nodes, connect components, rename items, and shape the diagram step by step.",
    accent: colors.steel,
    name: "solution-stage-2",
  });

  addPanel(ctx, slide, {
    x: 872,
    y: 272,
    width: 300,
    height: 192,
    eyebrow: "STAGE 3",
    title: "Keep it organized",
    body: "The design is stored in a structured form, so the system stays consistent and can keep improving over time.",
    accent: colors.gold,
    name: "solution-stage-3",
  });

  ctx.addShape(slide, {
    x: 238,
    y: 526,
    width: 804,
    height: 2,
    fill: colors.lineAccent,
    line: ctx.line(colors.lineAccent, 0),
    name: "solution-rail",
  });

  addTag(ctx, slide, {
    x: 528,
    y: 548,
    width: 224,
    text: "GUIDED DESIGN LOOP",
    fill: colors.bgSoft,
    line: colors.lineSubtle,
    color: colors.textPrimary,
    name: "solution-loop-tag",
  });

  addFooter(ctx, slide);
  return slide;
}
