import { apiPost, apiGet, apiDelete } from "@/core/lib/api"

export async function uploadPdf(payload: {
  filename: string
  originalName: string
  sizeBytes: number
  base64Content: string
  topic: string
  subject?: string
  groupId?: string
}) {
  return apiPost<{ id: string; originalName: string }>("/pdfs", payload)
}

export async function listPdfs() {
  return apiGet<Array<{ id: string; originalName: string; sizeBytes: number; uploadedAt: string }>>("/pdfs")
}

export async function deletePdf(id: string) {
  return apiDelete(`/pdfs/${id}`)
}
