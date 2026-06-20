import {
  addBackground,
  addChrome,
  addFooter,
  addKicker,
  addMetricPill,
  addPanel,
  addTitle,
} from "./theme.mjs";

export async function slide07(presentation, ctx) {
  const slide = presentation.slides.add();
  addBackground(ctx, slide);
  addChrome(ctx, slide, "IMPACT");
  addKicker(ctx, slide, "HOW IT HELPS");
  addTitle(ctx, slide, "The project helps users learn faster and present ideas with more confidence.", {
    width: 860,
    height: 92,
  });

  addPanel(ctx, slide, {
    x: 86,
    y: 236,
    width: 500,
    height: 250,
    eyebrow: "FOR LEARNING",
    title: "It reduces confusion",
    body: "Students can understand components, relationships, and flow in a more interactive way.\n\nInstead of only reading theory, they can see the structure and modify it directly.",
    bodySize: 18,
    titleSize: 24,
    name: "impact-learning",
  });

  addPanel(ctx, slide, {
    x: 696,
    y: 236,
    width: 500,
    height: 250,
    eyebrow: "FOR PRESENTATION",
    title: "It improves explanation quality",
    body: "A clear visual structure makes it easier to present the project to teachers, teammates, or reviewers.\n\nThe idea becomes easier to communicate and defend.",
    bodySize: 18,
    titleSize: 24,
    name: "impact-presentation",
  });

  addMetricPill(ctx, slide, {
    x: 236,
    y: 530,
    width: 180,
    label: "BENEFIT 01",
    value: "Clarity",
    name: "impact-metric-1",
  });
  addMetricPill(ctx, slide, {
    x: 550,
    y: 530,
    width: 180,
    label: "BENEFIT 02",
    value: "Speed",
    name: "impact-metric-2",
  });
  addMetricPill(ctx, slide, {
    x: 864,
    y: 530,
    width: 180,
    label: "BENEFIT 03",
    value: "Confidence",
    name: "impact-metric-3",
  });

  addFooter(ctx, slide);
  return slide;
}
