import {
  addAppShellMock,
  addBackground,
  addChrome,
  addFooter,
  addKicker,
  addPanel,
  addTitle,
} from "./theme.mjs";

export async function slide04(presentation, ctx) {
  const slide = presentation.slides.add();
  addBackground(ctx, slide);
  addChrome(ctx, slide, "FEATURES");
  addKicker(ctx, slide, "KEY FEATURES");
  addTitle(ctx, slide, "The best features are visible directly in the workspace, not just in a list.", {
    width: 850,
    height: 92,
  });

  addAppShellMock(ctx, slide, {
    x: 74,
    y: 216,
    width: 660,
    height: 372,
    name: "feature-shell",
  });

  addPanel(ctx, slide, {
    x: 780,
    y: 222,
    width: 360,
    height: 88,
    eyebrow: "CHAT PANEL",
    title: "AI guidance",
    body: "Users can ask about architecture while planning the design.",
    bodySize: 15,
    name: "feature-callout-1",
  });

  addPanel(ctx, slide, {
    x: 780,
    y: 326,
    width: 360,
    height: 88,
    eyebrow: "CANVAS",
    title: "Editable diagram area",
    body: "The canvas supports node creation, connection, update, and removal.",
    bodySize: 15,
    name: "feature-callout-2",
  });

  addPanel(ctx, slide, {
    x: 780,
    y: 430,
    width: 360,
    height: 88,
    eyebrow: "STATE",
    title: "Structured saving",
    body: "The design stays organized instead of becoming random or disconnected.",
    bodySize: 15,
    name: "feature-callout-3",
  });

  addPanel(ctx, slide, {
    x: 780,
    y: 534,
    width: 360,
    height: 72,
    fill: "#c4a88212",
    border: "#c4a88233",
    accent: "#c4a882",
    title: "Overall value",
    body: "One workspace for thinking, editing, and explaining.",
    titleSize: 16,
    bodySize: 14,
    name: "feature-callout-4",
  });

  addFooter(ctx, slide);
  return slide;
}
