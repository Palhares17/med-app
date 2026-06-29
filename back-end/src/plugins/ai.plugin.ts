import fp from "fastify-plugin";
import Anthropic from "@anthropic-ai/sdk";

export interface GeneratedCard {
  front: string;
  back: string;
}

export interface GeneratedFlashcards {
  subject: string;
  topic: string;
  cards: GeneratedCard[];
}

export interface AiService {
  generateFlashcards(input: {
    pdf: Buffer;
    count: number;
  }): Promise<GeneratedFlashcards>;
}

declare module "fastify" {
  interface FastifyInstance {
    ai: AiService;
  }
}

export class AiError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 502,
  ) {
    super(message);
    this.name = "AiError";
  }
}

const DEFAULT_MODEL = "claude-opus-4-8";

export const aiPlugin = fp(
  async (app) => {
    // Lê a config no boot; o cliente é criado sob demanda para que o servidor
    // suba mesmo sem ANTHROPIC_API_KEY (só a geração de flashcards falha).
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

    const ai: AiService = {
      async generateFlashcards({ pdf, count }) {
        if (!apiKey) {
          throw new AiError("ANTHROPIC_API_KEY não configurada.", 500);
        }

        const client = new Anthropic({ apiKey });

        const tool: Anthropic.Tool = {
          name: "save_flashcards",
          description:
            "Salva os flashcards de estudo gerados a partir do material enviado.",
          // strict garante que o input valide exatamente o schema.
          strict: true,
          input_schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              subject: {
                type: "string",
                description: "Disciplina/área do material (ex.: Cardiologia).",
              },
              topic: {
                type: "string",
                description:
                  "Tópico específico abordado (ex.: Insuficiência Cardíaca).",
              },
              cards: {
                type: "array",
                description: `Lista de aproximadamente ${count} flashcards.`,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    front: {
                      type: "string",
                      description:
                        "Frente do card: uma pergunta objetiva ou um conceito.",
                    },
                    back: {
                      type: "string",
                      description:
                        "Verso do card: a resposta/explicação correspondente.",
                    },
                  },
                  required: ["front", "back"],
                },
              },
            },
            required: ["subject", "topic", "cards"],
          },
        };

        const response = await client.messages.create({
          model,
          max_tokens: 8192,
          tools: [tool],
          tool_choice: { type: "tool", name: "save_flashcards" },
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "document",
                  source: {
                    type: "base64",
                    media_type: "application/pdf",
                    data: pdf.toString("base64"),
                  },
                },
                {
                  type: "text",
                  text:
                    `Você é um gerador de flashcards de estudo para estudantes de medicina. ` +
                    `Gere ${count} flashcards (frente/verso) em português (pt-BR) a partir do material em anexo. ` +
                    `Cada card deve cobrir um único conceito (atômico): a frente é uma pergunta direta ou um termo; ` +
                    `o verso é a resposta/explicação concisa e correta. Foque nos pontos de maior valor para revisão ativa ` +
                    `e evite duplicidade. Identifique a disciplina (subject) e o tópico principal (topic). ` +
                    `Use a ferramenta save_flashcards para retornar o resultado.`,
                },
              ],
            },
          ],
        });

        const block = response.content.find((b) => b.type === "tool_use");
        if (!block || block.type !== "tool_use") {
          throw new AiError("A IA não retornou flashcards.");
        }

        const result = block.input as GeneratedFlashcards;
        if (!result?.cards?.length) {
          throw new AiError("A IA retornou uma lista de flashcards vazia.");
        }
        return result;
      },
    };

    app.decorate("ai", ai);
  },
  { name: "ai-plugin" },
);
