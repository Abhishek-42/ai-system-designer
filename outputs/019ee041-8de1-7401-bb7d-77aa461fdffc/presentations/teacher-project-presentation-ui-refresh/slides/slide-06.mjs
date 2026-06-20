import {
  addBackground,
  addChrome,
  addFooter,
  addKicker,
  addPanel,
  addTitle,
  colors,
} from "./theme.mjs";

export async function slide06(presentation, ctx) {
  const slide = presentation.slides.add();
  addBackground(ctx, slide);
  addChrome(ctx, slide, "WORKFLOW");
  addKicker(ctx, slide, "HOW IT WORKS");
  addTitle(ctx, slide, "The full workflow can be explained as a clean four-step design cycle.", {
    width: 820,
    height: 92,
  });

  ctx.addShape(slide, {
    x: 116,
    y: 382,
    width: 1048,
    height: 2,
    fill: colors.lineAccent,
    line: ctx.line(colors.lineAccent, 0),
    name: "workflow-rail",
  });

  const steps = [
    { x: 96, num: "01", title: "Share the idea", body: "The user enters a project need or a system design question." },
    { x: 382, num: "02", title: "Get guidance", body: "The AI chat responds with direction and architecture support." },
    { x: 668, num: "03", title: "Edit the diagram", body: "The user adds nodes, edges, labels, and structure on the canvas." },
    { x: 954, num: "04", title: "Save and improve", body: "The updated design state remains organized for the next iteration." },
  ];

  for (const step of steps) {
    ctx.addShape(slide, {
      x: step.x + 64,
      y: 368,
      width: 30,
      height: 30,
      fill: colors.goldGlowStrong,
      line: ctx.line(colors.lineAccent, 1),
      name: `step-badge-${step.num}`,
    });
    ctx.addText(slide, {
      x: step.x + 64,
      y: 375,
      width: 30,
      height: 16,
      text: step.num,
      fontSize: 10,
      bold: true,
      color: colors.gold,
      face: ctx.fonts.mono,
      align: "center",
      name: `step-badge-text-${step.num}`,
    });

    addPanel(ctx, slide, {
      x: step.x,
      y: 248,
      width: 162,
      height: 116,
      eyebrow: "STEP",
      title: step.title,
      body: step.body,
      bodySize: 14,
      titleSize: 16,
      name: `workflow-step-${step.num}`,
    });
  }

  addPanel(ctx, slide, {
    x: 318,
    y: 478,
    width: 644,
    height: 82,
    fill: colors.bgRich,
    border: colors.lineAccent,
    accent: colors.gold,
    title: "Think -> guide -> edit -> save",
    body: "This cycle is what makes the tool useful in both learning and presentation.",
    bodySize: 15,
    name: "workflow-summary",
  });

  addFooter(ctx, slide);
  return slide;
}
