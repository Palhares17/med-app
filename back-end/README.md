# MedBrain — Backend

API REST em Fastify + TypeScript para a plataforma de estudos com IA.

## Stack
- **Runtime**: Node.js + TypeScript (tsx)
- **Framework**: Fastify v5 com Zod (type-safe)
- **DB**: PostgreSQL via Drizzle ORM (hospedado no Supabase)
- **IA**: OpenAI GPT-4o-mini
- **Auth**: JWT do Supabase Auth (Bearer token)

## Configuração

### 1. Variáveis de ambiente
```bash
cp .env.example .env
```
Preencha:
```
DATABASE_URL=postgresql://user:password@host:5432/medbrain
OPENAI_API_KEY=sk-...
FRONTEND_URL=http://localhost:3000
```

### 2. Instalar dependências
```bash
pnpm install
```

### 3. Rodar migrações
```bash
pnpm db:push
```

### 4. Iniciar em desenvolvimento
```bash
pnpm dev
```

Servidor em `http://localhost:3333`
Docs em `http://localhost:3333/docs`

## Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /users/sync | Sincroniza usuário após login Supabase |
| GET | /users/me | Perfil do usuário + medalhas |
| POST | /pdfs | Upload de PDF |
| GET | /pdfs | Listar PDFs do usuário |
| DELETE | /pdfs/:id | Deletar PDF |
| POST | /content/flashcards/generate | Gerar flashcards com IA |
| GET | /content/flashcards | Listar decks do usuário |
| GET | /content/flashcards/:id | Deck com flashcards |
| POST | /content/questions/generate | Gerar questões com IA |
| GET | /content/questions | Listar conjuntos do usuário |
| GET | /content/questions/:id | Questões do conjunto |
| POST | /scoring/answers | Responder questão (registra pontuação) |
| GET | /scoring/answers/history | Histórico de respostas |
| POST | /groups | Criar grupo |
| GET | /groups | Listar grupos do usuário |
| GET | /groups/:id | Detalhes do grupo + ranking |
| POST | /groups/join/:code | Entrar por código de convite |
| DELETE | /groups/:id | Deletar grupo (admin) |
| DELETE | /groups/:id/members/:memberId | Remover membro (admin) |
| GET | /groups/:id/ranking | Ranking semanal |

## Autenticação
Todas as rotas (exceto `GET /`) requerem header:
```
Authorization: Bearer <supabase-jwt>
```
