import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  integer,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const users = pgTable("users", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const uploadStatus = pgEnum("upload_status", [
  "uploading",
  "processing",
  "processed",
  "error",
]);

export const uploads = pgTable("uploads", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  userId: uuid().references(() => users.id),
  fileName: varchar({ length: 255 }).notNull(),
  fileSize: integer().notNull(),
  pages: integer().notNull(),
  status: uploadStatus().notNull().default("processing"),
  storagePath: text().notNull(),
  creditsUsed: integer().notNull().default(0),
  createdAt: timestamp().notNull().defaultNow(),
});

export const flashcardDecks = pgTable("flashcard_decks", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  uploadId: uuid()
    .notNull()
    .references(() => uploads.id),
  userId: uuid().references(() => users.id),
  topic: varchar({ length: 255 }).notNull(),
  subject: varchar({ length: 255 }).notNull(),
  cardCount: integer().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const flashcards = pgTable("flashcards", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  deckId: uuid()
    .notNull()
    .references(() => flashcardDecks.id),
  front: text().notNull(),
  back: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});
