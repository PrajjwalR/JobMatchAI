import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function parseResume(
  filePath: string,
  mimetype: string
): Promise<string> {
  console.log("Parsing file with mimetype:", mimetype);

  // Handle PDF files
  if (mimetype === "application/pdf" || mimetype === "pdf") {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      console.error("Error parsing PDF:", error);
      throw new Error(
        `Failed to parse PDF: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
  // Handle DOCX files
  else if (
    mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimetype === "application/zip" || // Sometimes DOCX files are detected as ZIP
    mimetype === "docx" ||
    mimetype.includes("wordprocessingml") ||
    mimetype.includes("docx")
  ) {
    try {
      const data = await mammoth.extractRawText({ path: filePath });
      return data.value;
    } catch (error) {
      console.error("Error parsing DOCX:", error);
      throw new Error(
        `Failed to parse DOCX: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
  // Handle plain text files
  else if (mimetype === "text/plain" || mimetype === "txt") {
    try {
      const data = fs.readFileSync(filePath, "utf8");
      return data;
    } catch (error) {
      console.error("Error reading text file:", error);
      throw new Error(
        `Failed to read text file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  } else {
    console.error("Unsupported mimetype:", mimetype);
    throw new Error(
      `Unsupported file type: ${mimetype}. Supported types: PDF, DOCX, TXT`
    );
  }
}
