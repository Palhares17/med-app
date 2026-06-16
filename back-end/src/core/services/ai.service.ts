import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface GeneratedFlashcard {
  front: string;
  back: string;
}

export interface GeneratedQuestion {
  question: string;
  alternatives: Array<{ id: string; text: string; isCorrect: boolean }>;
  explanation: string;
}

export async function generateFlashcards(
  text: string,
  topic: string,
  count = 10
): Promise<GeneratedFlashcard[]> {
  const prompt = `Você é um professor de medicina especialista em criar materiais de estudo.
Gere exatamente ${count} flashcards sobre o tópico "${topic}" baseado no texto abaixo.
Retorne APENAS um JSON válido, sem markdown, no formato:
[{"front":"pergunta/conceito","back":"resposta/explicação detalhada"}]

Texto:
${text.slice(0, 8000)}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const raw = response.choices[0].message.content ?? "{}";
  const parsed = JSON.parse(raw);
  const cards: GeneratedFlashcard[] = Array.isArray(parsed)
    ? parsed
    : (parsed.flashcards ?? []);
  return cards.slice(0, count);
}

export async function generateQuestions(
  text: string,
  topic: string,
  count = 8
): Promise<GeneratedQuestion[]> {
  const prompt = `Você é um professor de medicina especialista em criar questões objetivas.
Gere exatamente ${count} questões de múltipla escolha sobre o tópico "${topic}" baseado no texto abaixo.
Cada questão deve ter exatamente 4 alternativas e apenas 1 correta.
Retorne APENAS JSON válido, sem markdown, no formato:
{"questions":[{"question":"...","alternatives":[{"id":"a","text":"...","isCorrect":false},{"id":"b","text":"...","isCorrect":true},{"id":"c","text":"...","isCorrect":false},{"id":"d","text":"...","isCorrect":false}],"explanation":"..."}]}

Texto:
${text.slice(0, 8000)}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const raw = response.choices[0].message.content ?? "{}";
  const parsed = JSON.parse(raw);
  const qs: GeneratedQuestion[] = parsed.questions ?? [];
  return qs.slice(0, count);
}

export async function extractTextFromBase64(base64Pdf: string): Promise<string> {
  // Use OpenAI vision to extract text from first pages
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extraia todo o texto deste PDF de forma estruturada, mantendo os títulos e parágrafos:",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:application/pdf;base64,${base64Pdf}`,
            },
          },
        ],
      },
    ],
    max_tokens: 4000,
  });
  return response.choices[0].message.content ?? "";
}
