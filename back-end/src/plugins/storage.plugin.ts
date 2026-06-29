import fp from "fastify-plugin";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface StorageService {
  upload(path: string, body: Buffer, contentType: string): Promise<void>;
  download(path: string): Promise<Buffer>;
  getSignedUrl(path: string, expiresInSeconds?: number): Promise<string>;
  remove(path: string): Promise<void>;
}

declare module "fastify" {
  interface FastifyInstance {
    storage: StorageService;
  }
}

export const storagePlugin = fp(
  async (app) => {
    const url = process.env.SUPABASE_URL;
    // Chave de servidor (bypassa RLS). Novo formato: SUPABASE_SECRET_KEY (sb_secret_...);
    // legado: SUPABASE_SERVICE_ROLE_KEY (JWT). Usa o primeiro disponível.
    const key =
      process.env.SUPABASE_SECRET_KEY ??
      process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "uploads";

    if (!url || !key) {
      throw new Error(
        "SUPABASE_URL e SUPABASE_SECRET_KEY (ou SUPABASE_SERVICE_ROLE_KEY) são obrigatórios para o storage.plugin.",
      );
    }

    const client: SupabaseClient = createClient(url, key, {
      auth: { persistSession: false },
    });

    const storage: StorageService = {
      async upload(path, body, contentType) {
        const { error } = await client.storage
          .from(bucket)
          .upload(path, body, { contentType, upsert: false });
        if (error) throw error;
      },
      async download(path) {
        const { data, error } = await client.storage.from(bucket).download(path);
        if (error) throw error;
        return Buffer.from(await data.arrayBuffer());
      },
      async getSignedUrl(path, expiresInSeconds = 3600) {
        const { data, error } = await client.storage
          .from(bucket)
          .createSignedUrl(path, expiresInSeconds);
        if (error) throw error;
        return data.signedUrl;
      },
      async remove(path) {
        const { error } = await client.storage.from(bucket).remove([path]);
        if (error) throw error;
      },
    };

    app.decorate("storage", storage);
  },
  { name: "storage-plugin" },
);
