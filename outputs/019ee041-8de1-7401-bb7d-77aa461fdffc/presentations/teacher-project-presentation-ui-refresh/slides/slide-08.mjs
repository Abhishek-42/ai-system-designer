import {
  addBackground,
  addChrome,
  addFooter,
  addKicker,
  addPanel,
  addTitle,
  colors,
} from "./theme.mjs";

export async function slide08(presentation, ctx) {
  const slide = presentation.slides.add();
  addBackground(ctx, slide);
  addChrome(ctx, slide, "FUTURE");
  addKicker(ctx, slide, "FUTURE SCOPE");
  addTitle(ctx, slide, "This prototype can grow into a more advanced AI-assisted design platform over time.", {
    width: 920,
    height: 92,
  });

  ctx.addShape(slide, {
    x: 132,
    y: 422,
    width: 1010,
    height: 2,
    fill: colors.lineAccent,
    line: ctx.line(colors.lineAccent, 0),
    name: "future-line",
  });

  const milestones = [
    { x: 108, y: 250, title: "More diagram types", body: "Support for flowcharts, HLDs, LLDs, and broader architecture views." },
    { x: 366, y: 454, title: "Smarter AI actions", body: "The system can later suggest or apply diagram changes more directly." },
    { x: 624, y: 250, title: "Better project storage", body: "A stronger project database can replace the current single-file model." },
    { x: 882, y: 454, title: "Team collaboration", body: "Multiple users could review, edit, and improve ideas together." },
  ];

  milestones.forEach((item, index) => {
    ctx.addShape(slide, {
      x: item.x + 70,
      y: index % 2 === 0 ? 414 : 414,
      width: 18,
      height: 18,
      fill: colors.goldGlowStrong,
      line: ctx.line(colors.lineAccent, 1),
      name: `future-dot-${index + 1}`,
    });
    addPanel(ctx, slide, {
      x: item.x,
      y: item.y,
      width: 220,
      height: 124,
      eyebrow: `MILESTONE 0${index + 1}`,
      title: item.title,
      body: item.body,
      bodySize: 14,
      titleSize: 17,
      name: `future-panel-${index + 1}`,
    });
  });

  addFooter(ctx, slide);
  return slide;
}
