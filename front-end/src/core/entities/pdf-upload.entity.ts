export interface PdfUpload {
  id: string
  fileName: string
  fileSize: string
  pages: number
  uploadedAt: string
  status: "uploading" | "processing" | "processed" | "error"
  creditsUsed: number
}
