import { test } from "node:test";
import assert from "node:assert/strict";
import { FlashcardError, FlashcardsService } from "./flashcards.service";
import type {
  CreateDeckInput,
  DeckRow,
  FlashcardRow,
  FlashcardsRepository,
} from "./flashcards.repository";
import type { UploadsService } from "../uploads/uploads.service";
import type { UploadRow } from "../uploads/uploads.repository";
import type { AiService, GeneratedFlashcards } from "../../plugins/ai.plugin";
import type { StorageService } from "../../plugins/storage.plugin";

const USER_ID = "01900000-0000-7000-8000-0000000000ff";

function makeUploadRow(overrides: Partial<UploadRow> = {}): UploadRow {
  return {
    id: "01900000-0000-7000-8000-000000000001",
    userId: null,
    fileName: "material.pdf",
    fileSize: 1024,
    pages: 3,
    status: "processing",
    storagePath: "anonymous/01900000.pdf",
    creditsUsed: 0,
    createdAt: new Date(),
    ...overrides,
  };
}

function makeFakeUploads(record: UploadRow | undefined) {
  const calls: { status?: UploadRow["status"] } = {};
  const uploads = {
    async getRecord() {
      return record;
    },
    async setStatus(_id: string, status: UploadRow["status"]) {
      calls.status = status;
    },
  };
  return { uploads: uploads as unknown as UploadsService, calls };
}

function makeFakeRepo() {
  const calls: { created?: CreateDeckInput } = {};
  const repo = {
    async createDeck(input: CreateDeckInput) {
      calls.created = input;
      const deck: DeckRow = {
        id: "01900000-0000-7000-8000-0000000000aa",
        uploadId: input.uploadId,
        userId: input.userId,
        topic: input.topic,
        subject: input.subject,
        cardCount: input.cards.length,
        createdAt: new Date(),
      };
      const cards: FlashcardRow[] = input.cards.map((card, i) => ({
        id: `01900000-0000-7000-8000-00000000000${i}`,
        deckId: deck.id,
        front: card.front,
        back: card.back,
        createdAt: new Date(),
      }));
      return { deck, cards };
    },
    async findAllDecks() {
      return [];
    },
    async findDeckById() {
      return undefined;
    },
    async findCardsByDeckId() {
      return [];
    },
  };
  return { repo: repo as unknown as FlashcardsRepository, calls };
}

const fakeStorage = {
  async download() {
    return Buffer.from("%PDF-1.4 fake");
  },
} as unknown as StorageService;

function makeFakeAi(result: GeneratedFlashcards | Error): AiService {
  return {
    async generateFlashcards() {
      if (result instanceof Error) throw result;
      return result;
    },
  } as unknown as AiService;
}

test("falha quando o upload não existe", async () => {
  const { uploads } = makeFakeUploads(undefined);
  const { repo } = makeFakeRepo();
  const service = new FlashcardsService(
    repo,
    uploads,
    fakeStorage,
    makeFakeAi({ subject: "x", topic: "y", cards: [] }),
  );

  await assert.rejects(
    () =>
      service.generateFromUpload({
        uploadId: "01900000-0000-7000-8000-000000000099",
        userId: USER_ID,
      }),
    FlashcardError,
  );
});

test("gera deck, persiste cards e marca upload como processed", async () => {
  const { uploads, calls: uploadCalls } = makeFakeUploads(
    makeUploadRow({ userId: USER_ID }),
  );
  const { repo, calls: repoCalls } = makeFakeRepo();
  const ai = makeFakeAi({
    subject: "Cardiologia",
    topic: "Insuficiência Cardíaca",
    cards: [
      { front: "O que é IC?", back: "Síndrome clínica..." },
      { front: "Sintoma principal?", back: "Dispneia" },
    ],
  });
  const service = new FlashcardsService(repo, uploads, fakeStorage, ai);

  const deck = await service.generateFromUpload({
    uploadId: "01900000-0000-7000-8000-000000000001",
    userId: USER_ID,
  });

  assert.equal(deck.subject, "Cardiologia");
  assert.equal(deck.topic, "Insuficiência Cardíaca");
  assert.equal(deck.cardCount, 2);
  assert.equal(deck.cards.length, 2);
  assert.equal(deck.cards[0].front, "O que é IC?");
  assert.equal(repoCalls.created?.cards.length, 2);
  assert.equal(uploadCalls.status, "processed");
});

test("marca upload como error quando a IA falha", async () => {
  const { uploads, calls: uploadCalls } = makeFakeUploads(
    makeUploadRow({ userId: USER_ID }),
  );
  const { repo } = makeFakeRepo();
  const ai = makeFakeAi(new Error("boom"));
  const service = new FlashcardsService(repo, uploads, fakeStorage, ai);

  await assert.rejects(
    () =>
      service.generateFromUpload({
        uploadId: "01900000-0000-7000-8000-000000000001",
        userId: USER_ID,
      }),
    FlashcardError,
  );
  assert.equal(uploadCalls.status, "error");
});
