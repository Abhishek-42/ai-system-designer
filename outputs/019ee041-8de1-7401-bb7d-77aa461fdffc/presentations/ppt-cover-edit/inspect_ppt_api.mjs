import { PresentationFile, FileBlob } from "@oai/artifact-tool";

const pptxPath = "C:/Users/kabir/Desktop/diagrammaker-ai-teacher-presentation.pptx";

const presentation = await PresentationFile.importPptx(await FileBlob.load(pptxPath));
const slide = presentation.slides.getItem(0);

const payload = {
  slideCount: presentation.slides.count,
  slideMethods: Object.getOwnPropertyNames(Object.getPrototypeOf(slide)).sort(),
  slidesMethods: Object.getOwnPropertyNames(Object.getPrototypeOf(presentation.slides)).sort(),
};

console.log(JSON.stringify(payload, null, 2));
