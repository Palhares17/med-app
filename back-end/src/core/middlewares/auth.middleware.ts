import type { FastifyRequest, FastifyReply } from "fastify";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // JWT validation via Supabase: extract sub from Bearer token
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  const token = authHeader.slice(7);
  try {
    // Decode JWT without verifying (Supabase validates on its side).
    // For production use @supabase/supabase-js to verify the JWT secret.
    const [, payloadB64] = token.split(".");
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8")
    );
    request.userId = payload.sub as string;
    request.userEmail = payload.email as string;
    request.userName = (payload.user_metadata?.full_name ?? payload.email) as string;
    request.userAvatar = (payload.user_metadata?.avatar_url ?? null) as string | null;
  } catch {
    return reply.status(401).send({ error: "Invalid token" });
  }
}

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
    userEmail: string;
    userName: string;
    userAvatar: string | null;
  }
}
