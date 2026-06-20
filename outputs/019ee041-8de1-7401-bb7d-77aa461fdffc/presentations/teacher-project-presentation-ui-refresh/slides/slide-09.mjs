import {
  addAppShellMock,
  addBackground,
  addBody,
  addChrome,
  addFooter,
  addTag,
  addTitle,
  colors,
} from "./theme.mjs";

export async function slide09(presentation, ctx) {
  const slide = presentation.slides.add();
  addBackground(ctx, slide);
  addChrome(ctx, slide, "CLOSING");

  addTag(ctx, slide, {
    x: 74,
    y: 94,
    width: 116,
    text: "CONCLUSION",
    fill: colors.goldGlow,
    line: colors.lineAccent,
    color: colors.gold,
    name: "closing-tag",
  });

  addTitle(ctx, slide, "DiagramMaker AI turns project ideas into clearer visual understanding.", {
    y: 142,
    width: 620,
    height: 130,
    fontSize: 34,
  });

  addBody(
    ctx,
    slide,
    "The redesigned deck now matches the product better: dark workspace surfaces, muted gold actions, and structured panels that feel closer to the real interface.\n\nThe main story stays the same: the project helps users think, build, and explain diagrams more clearly.",
    {
      y: 304,
      width: 560,
      height: 168,
      fontSize: 20,
    },
  );

  addTag(ctx, slide, {
    x: 74,
    y: 536,
    width: 214,
    text: "THANK YOU / QUESTIONS",
    fill: colors.bgSoft,
    line: colors.lineSubtle,
    color: colors.textPrimary,
    name: "closing-qna",
  });

  addAppShellMock(ctx, slide, {
    x: 706,
    y: 128,
    width: 430,
    height: 360,
    name: "closing-shell",
  });

  ctx.addShape(slide, {
    x: 748,
    y: 518,
    width: 348,
    height: 84,
    fill: colors.bgRich,
    line: ctx.line(colors.lineAccent, 1),
    name: "closing-panel",
  });
  ctx.addText(slide, {
    x: 770,
    y: 538,
    width: 304,
    height: 42,
    text: "Modern visuals + same clear flow = a stronger classroom presentation.",
    fontSize: 18,
    bold: true,
    color: colors.textPrimary,
    face: ctx.fonts.body,
    align: "center",
    name: "closing-panel-text",
  });

  addFooter(ctx, slide, "AI Based Diagram Maker  //  modern UI themed deck");
  return slide;
}
