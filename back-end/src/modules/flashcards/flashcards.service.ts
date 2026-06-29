import type { AiService } from "../../plugins/ai.plugin";
import type { StorageService } from "../../plugins/storage.plugin";
import type { UploadsService } from "../uploads/uploads.service";
import type { DeckResponse, DeckSummary } from "./flashcards.schema";
import type {
  DeckRow,
  FlashcardRow,
  FlashcardsRepository,
} from "./flashcards.repository";

const DEFAULT_CARD_COUNT = 10; // DEFAULT_GENERATION_COUNT.flashcards do front-end

export interface GenerateFlashcardsCommand {
  uploadId: string;
  userId: string;
  count?: number;
}

/** Erro de validação/negócio do módulo, mapeado para status HTTP no controller. */
export class FlashcardError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400,
  ) {
    super(message);
    this.name = "FlashcardError";
  }
}

export class FlashcardsService {
  constructor(
    private readonly repository: FlashcardsRepository,
    private readonly uploadsService: UploadsService,
    private readonly storage: StorageService,
    private readonly ai: AiService,
  ) {}

  async generateFromUpload(
    command: GenerateFlashcardsCommand,
  ): Promise<DeckResponse> {
    const upload = await this.uploadsService.getRecord(command.uploadId);
    // 404 também quando o upload pertence a outro usuário (não vaza existência).
    if (!upload || upload.userId !== command.userId) {
      throw new FlashcardError("Upload não encontrado.", 404);
    }

    let pdf: Buffer;
    try {
      pdf = await this.storage.download(upload.storagePath);
    } catch {
      throw new FlashcardError(
        "Não foi possível baixar o PDF do storage.",
        502,
      );
    }

    const count = command.count ?? DEFAULT_CARD_COUNT;

    let generated;
    try {
      generated = await this.ai.generateFlashcards({ pdf, count });
    } catch (err) {
      await this.uploadsService.setStatus(upload.id, "error");
      throw err instanceof FlashcardError
        ? err
        : new FlashcardError(
            "Falha ao gerar flashcards a partir do PDF.",
            502,
          );
    }

    const { deck, cards } = await this.repository.createDeck({
      uploadId: upload.id,
      userId: command.userId,
      topic: generated.topic,
      subject: generated.subject,
      cards: generated.cards,
    });

    await this.uploadsService.setStatus(upload.id, "processed");

    return this.toDeckResponse(deck, cards);
  }

  async findAll(userId: string): Promise<DeckSummary[]> {
    const decks = await this.repository.findAllDecks(userId);
    return decks.map((deck) => this.toDeckSummary(deck));
  }

  async findById(id: string, userId: string): Promise<DeckResponse> {
    const deck = await this.repository.findDeckById(id);
    if (!deck || deck.userId !== userId) {
      throw new FlashcardError("Deck não encontrado.", 404);
    }
    const cards = await this.repository.findCardsByDeckId(deck.id);
    return this.toDeckResponse(deck, cards);
  }

  private toDeckSummary(deck: DeckRow): DeckSummary {
    return {
      id: deck.id,
      uploadId: deck.uploadId,
      topic: deck.topic,
      subject: deck.subject,
      cardCount: deck.cardCount,
      createdAt: deck.createdAt.toISOString(),
    };
  }

  private toDeckResponse(deck: DeckRow, cards: FlashcardRow[]): DeckResponse {
    return {
      ...this.toDeckSummary(deck),
      cards: cards.map((card) => ({
        id: card.id,
        front: card.front,
        back: card.back,
      })),
    };
  }
}
