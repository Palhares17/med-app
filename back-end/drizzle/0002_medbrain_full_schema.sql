-- Full schema migration for MedBrain

CREATE TABLE IF NOT EXISTS "topics" (
  "id" uuid PRIMARY KEY NOT NULL,
  "hash" varchar(64) NOT NULL UNIQUE,
  "topic" varchar(500) NOT NULL,
  "subject" varchar(255) NOT NULL DEFAULT 'Geral',
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "pdfs" (
  "id" uuid PRIMARY KEY NOT NULL,
  "user_id" varchar(255) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "group_id" uuid REFERENCES "groups"("id") ON DELETE SET NULL,
  "filename" varchar(500) NOT NULL,
  "original_name" varchar(500) NOT NULL,
  "size_bytes" integer NOT NULL,
  "uploaded_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "flashcard_decks" (
  "id" uuid PRIMARY KEY NOT NULL,
  "topic_id" uuid NOT NULL REFERENCES "topics"("id") ON DELETE CASCADE,
  "pdf_id" uuid REFERENCES "pdfs"("id") ON DELETE SET NULL,
  "user_id" varchar(255) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "flashcards" (
  "id" uuid PRIMARY KEY NOT NULL,
  "topic_id" uuid NOT NULL REFERENCES "topics"("id") ON DELETE CASCADE,
  "front" text NOT NULL,
  "back" text NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "question_sets" (
  "id" uuid PRIMARY KEY NOT NULL,
  "topic_id" uuid NOT NULL REFERENCES "topics"("id") ON DELETE CASCADE,
  "pdf_id" uuid REFERENCES "pdfs"("id") ON DELETE SET NULL,
  "user_id" varchar(255) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "questions" (
  "id" uuid PRIMARY KEY NOT NULL,
  "topic_id" uuid NOT NULL REFERENCES "topics"("id") ON DELETE CASCADE,
  "question" text NOT NULL,
  "alternatives" jsonb NOT NULL,
  "explanation" text NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "groups" (
  "id" uuid PRIMARY KEY NOT NULL,
  "name" varchar(255) NOT NULL,
  "description" text NOT NULL DEFAULT '',
  "created_by" varchar(255) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "invite_code" varchar(64) NOT NULL UNIQUE,
  "weekly_reset" timestamp with time zone NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "group_members" (
  "id" uuid PRIMARY KEY NOT NULL,
  "group_id" uuid NOT NULL REFERENCES "groups"("id") ON DELETE CASCADE,
  "user_id" varchar(255) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "joined_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "user_answers" (
  "id" uuid PRIMARY KEY NOT NULL,
  "user_id" varchar(255) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "question_id" uuid NOT NULL REFERENCES "questions"("id") ON DELETE CASCADE,
  "group_id" uuid REFERENCES "groups"("id") ON DELETE SET NULL,
  "selected_alternative_id" varchar(255) NOT NULL,
  "is_correct" boolean NOT NULL,
  "points_earned" integer NOT NULL DEFAULT 0,
  "answered_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "medals" (
  "id" uuid PRIMARY KEY NOT NULL,
  "user_id" varchar(255) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "group_id" uuid NOT NULL REFERENCES "groups"("id") ON DELETE CASCADE,
  "type" varchar(10) NOT NULL,
  "week_start" timestamp with time zone NOT NULL,
  "awarded_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- Add created_at to users if not exists
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatar" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone NOT NULL DEFAULT now();
