# MedBrain — Frontend

Interface React/Next.js para a plataforma de estudos com IA médica.

## Stack
- **Framework**: Next.js 16 (App Router)
- **UI**: shadcn/ui + Tailwind v4 + Radix UI
- **Animações**: GSAP
- **Forms**: React Hook Form + Zod
- **Toasts**: Sonner

## Configuração

### 1. Variáveis de ambiente
```bash
cp .env.local.example .env.local
```
Preencha:
```
NEXT_PUBLIC_API_URL=http://localhost:3333
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

### 2. Instalar dependências
```bash
pnpm install
```

### 3. Iniciar em desenvolvimento
```bash
pnpm dev
```

Acesse `http://localhost:3000`

## Integração com o Backend

Todas as chamadas à API passam por `src/core/lib/api.ts`.
O token de autenticação é lido do `localStorage` (chave `projeto-o:user.accessToken`).

### Fluxo de autenticação
1. Usuário clica em "Entrar com Google" → Supabase OAuth
2. Supabase redireciona de volta com JWT
3. Frontend chama `POST /users/sync` para criar/atualizar o usuário no backend
4. Token é salvo no localStorage e enviado em todas as requisições
