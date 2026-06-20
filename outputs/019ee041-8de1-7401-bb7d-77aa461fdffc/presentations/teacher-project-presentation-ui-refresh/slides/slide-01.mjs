import {
  addAppShellMock,
  addBackground,
  addBody,
  addChrome,
  addFooter,
  addMetricPill,
  addTag,
  addTitle,
  colors,
} from "./theme.mjs";

export async function slide01(presentation, ctx) {
  const slide = presentation.slides.add();
  addBackground(ctx, slide);
  addChrome(ctx, slide, "UI REFRESH");

  addTag(ctx, slide, {
    x: 74,
    y: 86,
    width: 214,
    text: "AI-ASSISTED DIAGRAM WORKSPACE",
    fill: colors.goldGlow,
    line: colors.lineAccent,
    color: colors.gold,
    name: "cover-tag",
  });

  addTitle(ctx, slide, "DiagramMaker AI", {
    y: 132,
    width: 420,
    fontSize: 38,
  });

  addBody(
    ctx,
    slide,
    "A smarter way to discuss, build, and improve system diagrams in one workspace. The presentation keeps the same story, but now the visual design feels closer to the real product UI.",
    {
      y: 236,
      width: 470,
      height: 116,
      fontSize: 20,
      color: colors.textBody,
    },
  );

  addMetricPill(ctx, slide, {
    x: 74,
    y: 394,
    width: 168,
    label: "CORE IDEA",
    value: "Chat + Canvas",
    name: "cover-metric-1",
  });
  addMetricPill(ctx, slide, {
    x: 258,
    y: 394,
    width: 168,
    label: "PROJECT STYLE",
    value: "Dark UI language",
    name: "cover-metric-2",
  });
  addMetricPill(ctx, slide, {
    x: 442,
    y: 394,
    width: 168,
    label: "MAIN VALUE",
    value: "Clearer design flow",
    name: "cover-metric-3",
  });

  ctx.addText(slide, {
    x: 74,
    y: 494,
    width: 516,
    height: 76,
    text: "The design direction is based on the project itself: deep black surfaces, muted gold actions, light borders, and a structured workspace layout.",
    fontSize: 18,
    color: colors.textSecondary,
    face: ctx.fonts.body,
    name: "cover-note",
  });

  addAppShellMock(ctx, slide, {
    x: 652,
    y: 110,
    width: 520,
    height: 444,
    name: "cover-shell",
  });

  addFooter(ctx, slide, "AI Based Diagram Maker  //  modern UI presentation");
  return slide;
}
