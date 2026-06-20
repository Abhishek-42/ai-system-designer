const { PresentationFile, FileBlob } = await import(
  "file:///C:/Users/kabir/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs"
);

const sourcePptx = "C:/Users/kabir/Desktop/diagrammaker-ai-teacher-presentation.pptx";
const outputPptx = process.argv[2];

if (!outputPptx) {
  throw new Error("Missing output pptx path");
}

function addTextBox(slide, { left, top, width, height, text, fontSize, bold = false, color = "#243447", typeface = "Aptos", fill = "#FFFFFF", borderFill = "#FFFFFF", align = "left" }) {
  const shape = slide.shapes.add({
    geometry: "rect",
    position: { left, top, width, height },
    fill,
    line: { style: "solid", fill: borderFill, width: 0 },
  });
  shape.text = text;
  shape.text.fontSize = fontSize;
  shape.text.bold = bold;
  shape.text.color = color;
  shape.text.typeface = typeface;
  shape.text.alignment = align;
  return shape;
}

function addFrame(slide, { left, top, width, height, label }) {
  slide.shapes.add({
    geometry: "rect",
    position: { left, top, width, height },
    fill: "#FCFDFE",
    line: { style: "dashed", fill: "#B7CCE0", width: 1.5 },
  });

  slide.shapes.add({
    geometry: "rect",
    position: { left: left + 16, top: top + 16, width: width - 32, height: height - 32 },
    fill: "#F4F8FC",
    line: { style: "solid", fill: "#F4F8FC", width: 0 },
  });

  addTextBox(slide, {
    left: left + 24,
    top: top + 26,
    width: width - 48,
    height: 28,
    text: label,
    fontSize: 15,
    bold: true,
    color: "#5B6774",
    fill: "#F4F8FC",
    borderFill: "#F4F8FC",
    align: "center",
  });

  addTextBox(slide, {
    left: left + 24,
    top: top + 68,
    width: width - 48,
    height: 26,
    text: "Paste image here",
    fontSize: 18,
    bold: true,
    color: "#17324D",
    fill: "#F4F8FC",
    borderFill: "#F4F8FC",
    align: "center",
  });
}

function styleSlide(slide, sectionLabel, title, subtitle) {
  slide.shapes.add({
    geometry: "rect",
    position: { left: 0, top: 0, width: 1280, height: 720 },
    fill: "#F7F3EC",
    line: { style: "solid", fill: "#F7F3EC", width: 0 },
  });

  slide.shapes.add({
    geometry: "rect",
    position: { left: 0, top: 0, width: 1280, height: 18 },
    fill: "#17324D",
    line: { style: "solid", fill: "#17324D", width: 0 },
  });

  slide.shapes.add({
    geometry: "rect",
    position: { left: 64, top: 56, width: 60, height: 12 },
    fill: "#C88A2D",
    line: { style: "solid", fill: "#C88A2D", width: 0 },
  });

  addTextBox(slide, {
    left: 136,
    top: 42,
    width: 280,
    height: 34,
    text: sectionLabel,
    fontSize: 17,
    bold: true,
    color: "#2E5B88",
    fill: "#F7F3EC",
    borderFill: "#F7F3EC",
  });

  addTextBox(slide, {
    left: 64,
    top: 98,
    width: 720,
    height: 82,
    text: title,
    fontSize: 30,
    bold: true,
    color: "#102033",
    typeface: "Aptos Display",
    fill: "#F7F3EC",
    borderFill: "#F7F3EC",
  });

  addTextBox(slide, {
    left: 64,
    top: 184,
    width: 760,
    height: 42,
    text: subtitle,
    fontSize: 18,
    color: "#667788",
    fill: "#F7F3EC",
    borderFill: "#F7F3EC",
  });

  addTextBox(slide, {
    left: 64,
    top: 684,
    width: 320,
    height: 16,
    text: "AI Based Diagram Maker",
    fontSize: 10,
    color: "#7A8793",
    typeface: "Aptos",
    fill: "#F7F3EC",
    borderFill: "#F7F3EC",
  });
}

const presentation = await PresentationFile.importPptx(await FileBlob.load(sourcePptx));

const slideA = presentation.slides.add();
styleSlide(
  slideA,
  "PROJECT IMAGES",
  "Project Interface And Working Screens",
  "Use these spaces to paste screenshots of the UI, workflow, or output."
);
addFrame(slideA, { left: 78, top: 254, width: 520, height: 328, label: "Image Slot 1" });
addFrame(slideA, { left: 682, top: 254, width: 520, height: 328, label: "Image Slot 2" });
slideA.moveTo(5);

const slideB = presentation.slides.add();
styleSlide(
  slideB,
  "ADDITIONAL IMAGES",
  "Extra Visuals Or Result Screens",
  "You can use this page for output images, demo steps, or final result screenshots."
);
addFrame(slideB, { left: 78, top: 254, width: 1124, height: 220, label: "Main Image Slot" });
addFrame(slideB, { left: 78, top: 496, width: 544, height: 108, label: "Small Image Slot 1" });
addFrame(slideB, { left: 658, top: 496, width: 544, height: 108, label: "Small Image Slot 2" });
slideB.moveTo(9);

const pptx = await PresentationFile.exportPptx(presentation);
await pptx.save(outputPptx);

console.log(JSON.stringify({ outputPptx, slideCount: presentation.slides.count }, null, 2));
