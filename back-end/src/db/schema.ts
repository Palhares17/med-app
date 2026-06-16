import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { relations } from "drizzle-orm";

// ─── USERS ────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: varchar({ length: 255 }).primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  avatar: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

// ─── PDFS ─────────────────────────────────────────────────────────────────────
export const pdfs = pgTable("pdfs", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  userId: varchar({ length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  groupId: uuid().references(() => groups.id, { onDelete: "set null" }),
  filename: varchar({ length: 500 }).notNull(),
  originalName: varchar({ length: 500 }).notNull(),
  sizeBytes: integer().notNull(),
  uploadedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

// ─── TOPICS (centralised by topic hash) ───────────────────────────────────────
export const topics = pgTable("topics", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  hash: varchar({ length: 64 }).notNull().unique(), // SHA-256 of normalised topic string
  topic: varchar({ length: 500 }).notNull(),
  subject: varchar({ length: 255 }).notNull().default("Geral"),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

// ─── FLASHCARD DECKS ──────────────────────────────────────────────────────────
export const flashcardDecks = pgTable("flashcard_decks", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  topicId: uuid()
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  pdfId: uuid().references(() => pdfs.id, { onDelete: "set null" }),
  userId: varchar({ length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const flashcards = pgTable("flashcards", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  topicId: uuid()
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  front: text().notNull(),
  back: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

// ─── QUESTION SETS ────────────────────────────────────────────────────────────
export const questionSets = pgTable("question_sets", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  topicId: uuid()
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  pdfId: uuid().references(() => pdfs.id, { onDelete: "set null" }),
  userId: varchar({ length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const questions = pgTable("questions", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  topicId: uuid()
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  question: text().notNull(),
  alternatives: jsonb().notNull(), // Array<{ id, text, isCorrect }>
  explanation: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

// ─── USER ANSWERS (history & scoring) ────────────────────────────────────────
export const userAnswers = pgTable("user_answers", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  userId: varchar({ length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  questionId: uuid()
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  groupId: uuid().references(() => groups.id, { onDelete: "set null" }),
  selectedAlternativeId: varchar({ length: 255 }).notNull(),
  isCorrect: boolean().notNull(),
  pointsEarned: integer().notNull().default(0),
  answeredAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

// ─── GROUPS ───────────────────────────────────────────────────────────────────
export const groups = pgTable("groups", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull().default(""),
  createdBy: varchar({ length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  inviteCode: varchar({ length: 64 }).notNull().unique(),
  weeklyReset: timestamp({ withTimezone: true }).notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const groupMembers = pgTable("group_members", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  groupId: uuid()
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  userId: varchar({ length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  joinedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

// ─── MEDAL HISTORY ────────────────────────────────────────────────────────────
export const medals = pgTable("medals", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  userId: varchar({ length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  groupId: uuid()
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  type: varchar({ length: 10 }).notNull(), // "gold" | "silver" | "bronze"
  weekStart: timestamp({ withTimezone: true }).notNull(),
  awardedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

// ─── RELATIONS ────────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  pdfs: many(pdfs),
  flashcardDecks: many(flashcardDecks),
  questionSets: many(questionSets),
  answers: many(userAnswers),
  groupMemberships: many(groupMembers),
  medals: many(medals),
}));

export const topicsRelations = relations(topics, ({ many }) => ({
  flashcards: many(flashcards),
  questions: many(questions),
  flashcardDecks: many(flashcardDecks),
  questionSets: many(questionSets),
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
  creator: one(users, { fields: [groups.createdBy], references: [users.id] }),
  members: many(groupMembers),
  pdfs: many(pdfs),
  answers: many(userAnswers),
  medals: many(medals),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, { fields: [groupMembers.groupId], references: [groups.id] }),
  user: one(users, { fields: [groupMembers.userId], references: [users.id] }),
}));
