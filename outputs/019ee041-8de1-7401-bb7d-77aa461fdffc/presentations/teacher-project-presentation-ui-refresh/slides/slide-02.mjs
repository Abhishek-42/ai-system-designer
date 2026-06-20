import {
  addBackground,
  addBody,
  addChrome,
  addFooter,
  addKicker,
  addPanel,
  addTitle,
  colors,
} from "./theme.mjs";

export async function slide02(presentation, ctx) {
  const slide = presentation.slides.add();
  addBackground(ctx, slide);
  addChrome(ctx, slide, "PROBLEM");
  addKicker(ctx, slide, "PROBLEM STATEMENT");
  addTitle(ctx, slide, "Creating system diagrams still feels slow, confusing, and difficult for many beginners.", {
    width: 560,
    height: 118,
  });

  addBody(
    ctx,
    slide,
    "The main issue is not only drawing boxes. It is understanding the idea clearly, organizing the parts, and explaining the flow in a way others can quickly follow.",
    {
      y: 266,
      width: 504,
      height: 110,
      fontSize: 20,
    },
  );

  addPanel(ctx, slide, {
    x: 654,
    y: 140,
    width: 488,
    height: 122,
    eyebrow: "01 / STARTING POINT",
    title: "Blank-page pressure",
    body: "Students often know the concept, but they do not know how to begin turning it into a clear system diagram.",
    accent: colors.gold,
    name: "problem-panel-1",
  });

  addPanel(ctx, slide, {
    x: 654,
    y: 286,
    width: 488,
    height: 122,
    eyebrow: "02 / WORKLOAD",
    title: "Too much manual effort",
    body: "Planning components, links, and structure manually takes time and interrupts the thinking process.",
    accent: colors.steel,
    border: colors.lineSubtle,
    name: "problem-panel-2",
  });

  addPanel(ctx, slide, {
    x: 654,
    y: 432,
    width: 488,
    height: 122,
    eyebrow: "03 / COMMUNICATION",
    title: "Weak project explanation",
    body: "When the architecture is unclear, it becomes harder to explain the idea to teachers, teammates, and reviewers.",
    accent: colors.ember,
    border: colors.lineEmber,
    name: "problem-panel-3",
  });

  addPanel(ctx, slide, {
    x: 74,
    y: 462,
    width: 520,
    height: 100,
    fill: colors.bgRich,
    border: colors.lineAccent,
    accent: colors.gold,
    title: "Why this matters",
    body: "A better workspace can reduce confusion and help users move from idea to explanation much faster.",
    bodySize: 17,
    name: "problem-summary",
  });

  addFooter(ctx, slide);
  return slide;
}
