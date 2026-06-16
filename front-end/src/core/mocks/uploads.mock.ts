import type { PdfUpload } from "@/core/entities/pdf-upload.entity"

export const mockUploads: PdfUpload[] = [
  {
    id: "upl_01cardiovascular",
    fileName: "Anatomia_Cardiovascular.pdf",
    fileSize: "4.2 MB",
    pages: 38,
    uploadedAt: "2026-02-20T14:22:00Z",
    status: "processed",
    creditsUsed: 8,
  },
  {
    id: "upl_02farmacologia",
    fileName: "Farmacologia_Basica.pdf",
    fileSize: "6.8 MB",
    pages: 52,
    uploadedAt: "2026-02-18T09:15:00Z",
    status: "processed",
    creditsUsed: 10,
  },
  {
    id: "upl_03neuroanatomia",
    fileName: "Neuroanatomia_Funcional.pdf",
    fileSize: "3.5 MB",
    pages: 27,
    uploadedAt: "2026-02-15T16:40:00Z",
    status: "processed",
    creditsUsed: 8,
  },
  {
    id: "upl_04bioquimica",
    fileName: "Bioquimica_Proteinas_e_Enzimas.pdf",
    fileSize: "5.1 MB",
    pages: 44,
    uploadedAt: "2026-02-10T11:05:00Z",
    status: "processed",
    creditsUsed: 9,
  },
]
