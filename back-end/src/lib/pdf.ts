import { PDFDocument } from "pdf-lib";

/**
 * Conta as páginas de um PDF a partir do seu buffer.
 * Lança erro se o buffer não for um PDF válido.
 */
export async function countPdfPages(buffer: Buffer): Promise<number> {
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  return doc.getPageCount();
}
