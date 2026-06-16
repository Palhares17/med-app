import { z } from "zod";

export const UploadPdfSchema = z.object({
  filename: z.string(),
  originalName: z.string(),
  sizeBytes: z.number(),
  groupId: z.uuid().optional(),
  base64Content: z.string(), // base64 encoded PDF
  topic: z.string().min(1),
  subject: z.string().default("Geral"),
});
export type UploadPdfInput = z.infer<typeof UploadPdfSchema>;

export const PdfResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  groupId: z.string().nullable(),
  filename: z.string(),
  originalName: z.string(),
  sizeBytes: z.number(),
  uploadedAt: z.string(),
});
