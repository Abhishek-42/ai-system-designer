const { PresentationFile, FileBlob } = await import(
  "file:///C:/Users/kabir/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs"
);

const sourcePptx = "C:/Users/kabir/Desktop/diagrammaker-ai-teacher-presentation.pptx";
const outputPptx = process.argv[2];

if (!outputPptx) {
  throw new Error("Missing output pptx path");
}

function addText(slide, opts) {
  const shape = slide.shapes.add({
    geometry: "rect",
    position: { left: opts.left, top: opts.top, width: opts.width, height: opts.height },
    fill: opts.fill ?? "#FFFFFF",
    line: { style: "solid", fill: opts.lineFill ?? (opts.fill ?? "#FFFFFF"), width: opts.lineWidth ?? 0 },
    name: opts.name,
  });
  shape.text = opts.text;
  shape.text.fontSize = opts.fontSize ?? 16;
  shape.text.bold = Boolean(opts.bold);
  shape.text.color = opts.color ?? "#243447";
  shape.text.typeface = opts.typeface ?? "Aptos";
  if (opts.align) shape.text.alignment = opts.align;
  return shape;
}

function addImagePlaceholder(slide, opts) {
  slide.shapes.add({
    geometry: "rect",
    position: { left: opts.left, top: opts.top, width: opts.width, height: opts.height },
    fill: "#F7F3EC",
    line: { style: "solid", fill: "#F7F3EC", width: 0 },
    name: `${opts.name}-mask`,
  });

  slide.shapes.add({
    geometry: "rect",
    position: { left: opts.left + 8, top: opts.top + 8, width: opts.width - 16, height: opts.height - 16 },
    fill: "#FFFFFF",
    line: { style: "dashed", fill: "#C8D8EA", width: 1.5 },
    name: `${opts.name}-frame`,
  });

  addText(slide, {
    left: opts.left + 28,
    top: opts.top + 26,
    width: opts.width - 56,
    height: 24,
    text: opts.title,
    fontSize: 20,
    bold: true,
    color: "#17324D",
    typeface: "Aptos Display",
    fill: "#FFFFFF",
    lineFill: "#FFFFFF",
    align: "center",
    name: `${opts.name}-title`,
  });

  addText(slide, {
    left: opts.left + 28,
    top: opts.top + 64,
    width: opts.width - 56,
    height: 22,
    text: "Paste image here",
    fontSize: 16,
    bold: true,
    color: "#5B6774",
    fill: "#FFFFFF",
    lineFill: "#FFFFFF",
    align: "center",
    name: `${opts.name}-label`,
  });

  addText(slide, {
    left: opts.left + 34,
    top: opts.top + opts.height - 58,
    width: opts.width - 68,
    height: 36,
    text: opts.caption,
    fontSize: 13,
    color: "#7A8793",
    fill: "#FFFFFF",
    lineFill: "#FFFFFF",
    align: "center",
    name: `${opts.name}-caption`,
  });
}

const presentation = await PresentationFile.importPptx(await FileBlob.load(sourcePptx));

// Slide 3: Problem statement - replace right stacked cards with one visual slot
addImagePlaceholder(presentation.slides.getItem(2), {
  left: 676,
  top: 122,
  width: 490,
  height: 430,
  title: "Problem / Motivation Image",
  caption: "Use this area for a screenshot, reference image, or visual example related to the problem.",
  name: "problem-image",
});

// Slide 5: Key features - free the right side for a UI screenshot
addImagePlaceholder(presentation.slides.getItem(4), {
  left: 630,
  top: 214,
  width: 540,
  height: 310,
  title: "Feature / UI Screenshot",
  caption: "Paste an interface screenshot or feature demo image here.",
  name: "features-image",
});

// Slide 8: How it helps - reserve the right side for output/result images
addImagePlaceholder(presentation.slides.getItem(7), {
  left: 646,
  top: 206,
  width: 560,
  height: 340,
  title: "Result / Demo Image",
  caption: "Use this area for a result image, working screen, or user-facing output.",
  name: "impact-image",
});

const pptx = await PresentationFile.exportPptx(presentation);
await pptx.save(outputPptx);

console.log(JSON.stringify({ outputPptx, slideCount: presentation.slides.count }, null, 2));
