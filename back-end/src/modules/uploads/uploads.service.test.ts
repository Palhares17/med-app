import { test } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import { UploadError, UploadsService } from "./uploads.service";
import type {
  NewUpload,
  UploadRow,
  UploadsRepository,
} from "./uploads.repository";
import type { StorageService } from "../../plugins/storage.plugin";

function makeFakeRepo() {
  const calls: { created?: NewUpload } = {};
  const repo = {
    async create(data: NewUpload): Promise<UploadRow> {
      calls.created = data;
      return {
        id: "01900000-0000-7000-8000-000000000000",
        createdAt: new Date(),
        userId: null,
        creditsUsed: 0,
        ...data,
      } as UploadRow;
    },
    async findAll() {
      return [];
    },
    async findById() {
      return undefined;
    },
    async updateStatus() {
      return undefined;
    },
  };
  return { repo: repo as unknown as UploadsRepository, calls };
}

function makeFakeStorage() {
  const calls: { path?: string; contentType?: string } = {};
  const storage = {
    async upload(path: string, _body: Buffer, contentType: string) {
      calls.path = path;
      calls.contentType = contentType;
    },
    async getSignedUrl() {
      return "https://example.com/signed";
    },
    async remove() {},
  };
  return { storage: storage as unknown as StorageService, calls };
}

async function pdfBytes(pageCount: number): Promise<Buffer> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) doc.addPage();
  return Buffer.from(await doc.save());
}

test("rejeita arquivo que não é PDF", async () => {
  const { repo } = makeFakeRepo();
  const { storage } = makeFakeStorage();
  const service = new UploadsService(repo, storage);

  await assert.rejects(
    () =>
      service.upload({
        fileName: "notas.txt",
        mimeType: "text/plain",
        buffer: Buffer.from("oi"),
      }),
    UploadError,
  );
});

test("rejeita arquivo acima de 20 MB", async () => {
  const { repo } = makeFakeRepo();
  const { storage } = makeFakeStorage();
  const service = new UploadsService(repo, storage);

  const big = Buffer.alloc(20 * 1024 * 1024 + 1);
  await assert.rejects(
    () =>
      service.upload({
        fileName: "grande.pdf",
        mimeType: "application/pdf",
        buffer: big,
      }),
    UploadError,
  );
});

test("rejeita PDF com mais de 100 páginas", async () => {
  const { repo } = makeFakeRepo();
  const { storage } = makeFakeStorage();
  const service = new UploadsService(repo, storage);

  const buffer = await pdfBytes(101);
  await assert.rejects(
    () =>
      service.upload({
        fileName: "longo.pdf",
        mimeType: "application/pdf",
        buffer,
      }),
    UploadError,
  );
});

test("armazena e persiste um PDF válido", async () => {
  const { repo, calls: repoCalls } = makeFakeRepo();
  const { storage, calls: storageCalls } = makeFakeStorage();
  const service = new UploadsService(repo, storage);

  const buffer = await pdfBytes(3);
  const res = await service.upload({
    fileName: "valido.pdf",
    mimeType: "application/pdf",
    buffer,
  });

  assert.equal(res.status, "processing");
  assert.equal(res.pages, 3);
  assert.equal(res.creditsUsed, 0);
  assert.match(res.fileSize, /KB|MB/);
  assert.equal(storageCalls.contentType, "application/pdf");
  assert.ok(storageCalls.path?.endsWith(".pdf"));
  assert.equal(repoCalls.created?.status, "processing");
});
