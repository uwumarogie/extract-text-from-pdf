import {
  type PDFPageProxy,
  getDocument,
  GlobalWorkerOptions,
} from "pdfjs-dist";

GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@5.2.133/build/pdf.worker.min.mjs";

function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.readAsArrayBuffer(file);
  });
}

async function extractTextFromPdf(data: ArrayBuffer): Promise<string> {
  const pdf = await getDocument({ data }).promise;
  const numPages = pdf.numPages;
  const pageTexts: string[] = [];

  for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
    const page: PDFPageProxy = await pdf.getPage(pageNumber);
    const { items } = await page.getTextContent();
    const pageStr = items.map((item) => (item as any).str).join(" ");
    pageTexts.push(pageStr);
  }

  return pageTexts.join("\n\n");
}

function isDragEvent(
  event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>,
): event is React.DragEvent<HTMLDivElement> {
  return "dataTransfer" in event;
}

export async function handleFile(
  event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>,
  setFile: React.Dispatch<React.SetStateAction<File | null>>,
  simulateExtraction: () => void,
  setText: React.Dispatch<React.SetStateAction<string>>,
) {
  const file = isDragEvent(event)
    ? event.dataTransfer?.files?.[0]
    : event.target.files?.[0];

  event.preventDefault();
  if (file) {
    setFile(file);
    simulateExtraction();
    const data = await readFileAsArrayBuffer(file);
    const text = await extractTextFromPdf(data);
    console.debug("Extracted text:", text);
    setText(text);
  }
}
