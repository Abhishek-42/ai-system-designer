import { PresentationFile, FileBlob } from "@oai/artifact-tool";

const sourcePptx = "C:/Users/kabir/Desktop/diagrammaker-ai-teacher-presentation.pptx";
const outputPptx = process.argv[2];

if (!outputPptx) {
  throw new Error("Missing output pptx path");
}

const presentation = await PresentationFile.importPptx(await FileBlob.load(sourcePptx));

const slide = presentation.slides.add();
slide.moveTo(0);

slide.shapes.add({
  geometry: "rect",
  position: { left: 0, top: 0, width: 1280, height: 720 },
  fill: "#F7F3EC",
  line: { style: "solid", fill: "#F7F3EC", width: 0 },
  name: "background",
});

slide.shapes.add({
  geometry: "rect",
  position: { left: 0, top: 0, width: 1280, height: 18 },
  fill: "#17324D",
  line: { style: "solid", fill: "#17324D", width: 0 },
  name: "top-band",
});

slide.shapes.add({
  geometry: "rect",
  position: { left: 64, top: 94, width: 152, height: 28 },
  fill: "#F6E8D5",
  line: { style: "solid", fill: "#C88A2D", width: 1 },
  name: "project-tag",
});

const tagText = slide.shapes.add({
  geometry: "rect",
  position: { left: 76, top: 100, width: 128, height: 16 },
  fill: "#F6E8D5",
  line: { style: "solid", fill: "#F6E8D5", width: 0 },
  name: "project-tag-text",
});
tagText.text = "PROJECT";
tagText.text.fontSize = 14;
tagText.text.bold = true;
tagText.text.color = "#8B5F1C";
tagText.text.typeface = "Aptos";

const title = slide.shapes.add({
  geometry: "rect",
  position: { left: 64, top: 146, width: 610, height: 60 },
  fill: "#F7F3EC",
  line: { style: "solid", fill: "#F7F3EC", width: 0 },
  name: "title",
});
title.text = "DiagramMaker AI";
title.text.fontSize = 34;
title.text.bold = true;
title.text.color = "#102033";
title.text.typeface = "Aptos Display";

const subtitle = slide.shapes.add({
  geometry: "rect",
  position: { left: 64, top: 222, width: 560, height: 70 },
  fill: "#F7F3EC",
  line: { style: "solid", fill: "#F7F3EC", width: 0 },
  name: "subtitle",
});
subtitle.text = "AI-assisted system design workspace for discussing, creating, and improving diagrams.";
subtitle.text.fontSize = 20;
subtitle.text.color = "#394B5D";
subtitle.text.typeface = "Aptos";

slide.shapes.add({
  geometry: "rect",
  position: { left: 708, top: 114, width: 468, height: 470 },
  fill: "#FFFFFF",
  line: { style: "solid", fill: "#D9E6F2", width: 1 },
  name: "details-card",
});

const detailsTitle = slide.shapes.add({
  geometry: "rect",
  position: { left: 746, top: 146, width: 250, height: 28 },
  fill: "#FFFFFF",
  line: { style: "solid", fill: "#FFFFFF", width: 0 },
  name: "details-title",
});
detailsTitle.text = "Student Details";
detailsTitle.text.fontSize = 24;
detailsTitle.text.bold = true;
detailsTitle.text.color = "#102033";
detailsTitle.text.typeface = "Aptos Display";

const labels = [
  ["Project Name", "{project name}"],
  ["Prepared By", "{your name}"],
  ["Roll Number", "{roll number}"],
  ["Section", "{section}"],
];

let y = 212;
for (const [label, value] of labels) {
  const labelShape = slide.shapes.add({
    geometry: "rect",
    position: { left: 746, top: y, width: 170, height: 22 },
    fill: "#FFFFFF",
    line: { style: "solid", fill: "#FFFFFF", width: 0 },
    name: `label-${label}`,
  });
  labelShape.text = label;
  labelShape.text.fontSize = 16;
  labelShape.text.bold = true;
  labelShape.text.color = "#5B6774";
  labelShape.text.typeface = "Aptos";

  slide.shapes.add({
    geometry: "rect",
    position: { left: 746, top: y + 28, width: 350, height: 42 },
    fill: "#F8FAFC",
    line: { style: "solid", fill: "#DCEAF7", width: 1 },
    name: `field-${label}`,
  });

  const valueShape = slide.shapes.add({
    geometry: "rect",
    position: { left: 764, top: y + 38, width: 314, height: 20 },
    fill: "#F8FAFC",
    line: { style: "solid", fill: "#F8FAFC", width: 0 },
    name: `value-${label}`,
  });
  valueShape.text = value;
  valueShape.text.fontSize = 17;
  valueShape.text.color = "#17324D";
  valueShape.text.typeface = "Aptos";

  y += 86;
}

slide.shapes.add({
  geometry: "rect",
  position: { left: 64, top: 556, width: 560, height: 70 },
  fill: "#17324D",
  line: { style: "solid", fill: "#17324D", width: 0 },
  name: "footer-panel",
});

const footerText = slide.shapes.add({
  geometry: "rect",
  position: { left: 88, top: 578, width: 512, height: 24 },
  fill: "#17324D",
  line: { style: "solid", fill: "#17324D", width: 0 },
  name: "footer-text",
});
footerText.text = "Edit the placeholders and start presenting.";
footerText.text.fontSize = 18;
footerText.text.bold = true;
footerText.text.color = "#FFFFFF";
footerText.text.typeface = "Aptos";

const pptx = await PresentationFile.exportPptx(presentation);
await pptx.save(outputPptx);

console.log(JSON.stringify({ outputPptx, slideCount: presentation.slides.count }, null, 2));
