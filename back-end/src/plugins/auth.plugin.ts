import fp from "fastify-plugin";
import type { FastifyReply, FastifyRequest } from "fastify";
import { createRemoteJWKSet, jwtVerify } from "jose";

export interface AuthUser {
  id: string;
  email: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthUser;
  }
  interface FastifyInstance {
    // preHandler que exige um JWT válido do Supabase e popula request.user.
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}

export const authPlugin = fp(
  async (app) => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const jwksUrl = process.env.SUPABASE_JWKS_URL;

    if (!supabaseUrl || !jwksUrl) {
      throw new Error(
        "SUPABASE_URL e SUPABASE_JWKS_URL são obrigatórios para o auth.plugin.",
      );
    }

    // JWKS remoto do Supabase (chaves de assinatura assimétricas, cacheadas).
    const jwks = createRemoteJWKSet(new URL(jwksUrl));
    const issuer = `${supabaseUrl}/auth/v1`;

    app.decorate(
      "authenticate",
      async (request: FastifyRequest, reply: FastifyReply) => {
        const header = request.headers.authorization;
        if (!header?.startsWith("Bearer ")) {
          return reply
            .status(401)
            .send({ message: "Token de autenticação ausente." });
        }

        const token = header.slice("Bearer ".length);

        let payload;
        try {
          const verified = await jwtVerify(token, jwks, {
            issuer,
            audience: "authenticated",
          });
          payload = verified.payload;
        } catch {
          return reply
            .status(401)
            .send({ message: "Token inválido ou expirado." });
        }

        const id = payload.sub;
        if (!id) {
          return reply
            .status(401)
            .send({ message: "Token sem identificador de usuário." });
        }

        const email = (payload.email as string | undefined) ?? "";
        const metadata =
          (payload.user_metadata as
            | { full_name?: string; name?: string }
            | undefined) ?? {};
        const name = metadata.full_name ?? metadata.name ?? email ?? "Usuário";

        // Sincroniza/garante o usuário local para satisfazer a FK user_id.
        await app.users.service.ensureUser({ id, email, name });

        request.user = { id, email };
      },
    );
  },
  { name: "auth-plugin", dependencies: ["db-plugin", "users-plugin"] },
);
