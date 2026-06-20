import fs from "node:fs/promises";
import path from "node:path";

const { PresentationFile, FileBlob } = await import(
  "file:///C:/Users/kabir/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs"
);

const pptxPath = "C:/Users/kabir/Desktop/diagrammaker-ai-teacher-presentation.pptx";
const previewDir = process.argv[2];

if (!previewDir) {
  throw new Error("Missing preview output directory");
}

await fs.mkdir(previewDir, { recursive: true });

const presentation = await PresentationFile.importPptx(await FileBlob.load(pptxPath));

for (let i = 0; i < presentation.slides.count; i += 1) {
  const slide = presentation.slides.getItem(i);
  const png = await presentation.export({ slide, format: "png", scale: 1 });
  const buffer = Buffer.from(await png.arrayBuffer());
  const out = path.join(previewDir, `slide-${String(i + 1).padStart(2, "0")}.png`);
  await fs.writeFile(out, buffer);
}

console.log(JSON.stringify({ slideCount: presentation.slides.count, previewDir }, null, 2));
