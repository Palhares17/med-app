import { z } from "zod";

export const UploadStatusSchema = z.enum([
  "uploading",
  "processing",
  "processed",
  "error",
]);

// Espelha a entidade PdfUpload do front-end.
export const UploadResponseSchema = z.object({
  id: z.uuid(),
  fileName: z.string(),
  fileSize: z.string(), // formatado, ex.: "1.2 MB"
  pages: z.number().int(),
  uploadedAt: z.string(),
  status: UploadStatusSchema,
  creditsUsed: z.number().int(),
});
export type UploadResponse = z.infer<typeof UploadResponseSchema>;

// Resposta do detalhe inclui a URL assinada de download.
export const UploadDetailSchema = UploadResponseSchema.extend({
  downloadUrl: z.url(),
});
export type UploadDetail = z.infer<typeof UploadDetailSchema>;

export const UploadParamsSchema = z.object({
  id: z.uuid(),
});
