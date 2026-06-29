import { uuidv7 } from "uuidv7";
import { countPdfPages } from "../../lib/pdf";
import type { StorageService } from "../../plugins/storage.plugin";
import type { UploadResponse } from "./uploads.schema";
import type { UploadRow, UploadsRepository } from "./uploads.repository";

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB (UPLOAD_LIMITS do front-end)
const MAX_PAGES = 100;
const ALLOWED_MIME = "application/pdf";

export interface UploadFileInput {
  fileName: string;
  mimeType: string;
  buffer: Buffer;
  userId?: string | null;
}

/** Erro de validação/negócio do módulo, mapeado para status HTTP no controller. */
export class UploadError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400,
  ) {
    super(message);
    this.name = "UploadError";
  }
}

export class UploadsService {
  constructor(
    private readonly repository: UploadsRepository,
    private readonly storage: StorageService,
  ) {}

  async upload(input: UploadFileInput): Promise<UploadResponse> {
    if (input.mimeType !== ALLOWED_MIME) {
      throw new UploadError("Apenas arquivos PDF são permitidos.");
    }
    if (input.buffer.length > MAX_FILE_SIZE_BYTES) {
      throw new UploadError("O arquivo excede o limite de 20 MB.");
    }

    let pages: number;
    try {
      pages = await countPdfPages(input.buffer);
    } catch {
      throw new UploadError("Não foi possível ler o PDF enviado.");
    }
    if (pages > MAX_PAGES) {
      throw new UploadError(`O PDF excede o limite de ${MAX_PAGES} páginas.`);
    }

    const userId = input.userId ?? null;
    const storagePath = `${userId ?? "anonymous"}/${uuidv7()}.pdf`;
    await this.storage.upload(storagePath, input.buffer, ALLOWED_MIME);

    // status "processing": aguarda a geração de flashcards (próximo módulo).
    const row = await this.repository.create({
      userId,
      fileName: input.fileName,
      fileSize: input.buffer.length,
      pages,
      status: "processing",
      storagePath,
      creditsUsed: 0,
    });

    return this.toResponse(row);
  }

  async findAll(userId: string): Promise<UploadResponse[]> {
    const rows = await this.repository.findAll(userId);
    return rows.map((row) => this.toResponse(row));
  }

  /** Acesso interno ao registro bruto (usado pelo módulo de flashcards). */
  async getRecord(id: string): Promise<UploadRow | undefined> {
    return this.repository.findById(id);
  }

  /** Atualiza o status de um upload (ex.: flashcards → "processed"/"error"). */
  async setStatus(id: string, status: UploadRow["status"]): Promise<void> {
    await this.repository.updateStatus(id, status);
  }

  async findById(
    id: string,
    userId: string,
  ): Promise<{ upload: UploadResponse; downloadUrl: string }> {
    const row = await this.repository.findById(id);
    if (!row || row.userId !== userId) {
      throw new UploadError("Upload não encontrado.", 404);
    }
    const downloadUrl = await this.storage.getSignedUrl(row.storagePath);
    return { upload: this.toResponse(row), downloadUrl };
  }

  private toResponse(row: UploadRow): UploadResponse {
    return {
      id: row.id,
      fileName: row.fileName,
      fileSize: formatBytes(row.fileSize),
      pages: row.pages,
      uploadedAt: row.createdAt.toISOString(),
      status: row.status,
      creditsUsed: row.creditsUsed,
    };
  }
}

function formatBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  const kb = bytes / 1024;
  return `${Math.max(1, Math.round(kb))} KB`;
}
