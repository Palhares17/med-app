import type { PdfsRepository } from "./pdfs.repository";

export class PdfsService {
  constructor(private readonly repository: PdfsRepository) {}

  async upload(
    userId: string,
    input: {
      filename: string;
      originalName: string;
      sizeBytes: number;
      groupId?: string | null;
    }
  ) {
    const MAX_SIZE = 20 * 1024 * 1024; // 20 MB
    if (input.sizeBytes > MAX_SIZE) {
      throw new Error("Arquivo excede o tamanho máximo de 20 MB");
    }
    return this.repository.create({ ...input, userId });
  }

  async list(userId: string) {
    return this.repository.findByUser(userId);
  }

  async remove(id: string, userId: string) {
    const pdf = await this.repository.findById(id);
    if (!pdf) throw new Error("PDF não encontrado");
    if (pdf.userId !== userId) throw new Error("Sem permissão");
    await this.repository.delete(id, userId);
  }
}
