# MedBrain — Front-end

App web do MedBrain: plataforma de estudos médicos com IA (flashcards, questões e grupos). Construído com **Next.js 16** (App Router), **React 19**, **Tailwind v4** e **shadcn/ui**.

> Toda a UI está em **pt-BR**. O front-end ainda opera com dados mockados; a integração com o back-end será feita em fases seguintes.

---

## Pré-requisitos

- **Node.js** 20 ou superior
- **pnpm** 9 ou superior (gerenciador padrão do projeto)

Verifique as versões:

```bash
node -v
pnpm -v
```

Se não tiver o pnpm:

```bash
npm install -g pnpm
```

---

## Como rodar

Todos os comandos devem ser executados **dentro do diretório `front-end/`**.

### 1. Instalar dependências

```bash
cd front-end
pnpm install
```

### 2. Subir o servidor de desenvolvimento

```bash
pnpm dev
```

A aplicação ficará disponível em:

```
http://localhost:3000
```

### 3. Build de produção

```bash
pnpm build
pnpm start
```

---

## Scripts disponíveis

| Comando      | O que faz                                          |
| ------------ | -------------------------------------------------- |
| `pnpm dev`   | Sobe o servidor de desenvolvimento (Next.js)       |
| `pnpm build` | Gera o build de produção                           |
| `pnpm start` | Roda o build de produção                           |
| `pnpm lint`  | Executa o ESLint sobre o projeto                   |

### Adicionar componentes do shadcn/ui

```bash
pnpm dlx shadcn@latest add <nome-do-componente>
```

Exemplo:

```bash
pnpm dlx shadcn@latest add button
```

---

## Estrutura de pastas

```
front-end/src/
├── app/                      # Next.js App Router
│   ├── (auth)/login/         # Rota pública
│   ├── (app)/                # Rotas protegidas (guard em layout.tsx)
│   │   ├── dashboard/
│   │   ├── upload/
│   │   ├── flashcards/       # Lista + [id] sessão de estudo
│   │   ├── questoes/         # Lista + [id] sessão de quiz
│   │   └── grupos/           # Lista + [id] detalhe do grupo
│   ├── layout.tsx            # Layout raiz (fontes, tema dark, Sonner)
│   └── globals.css           # Tailwind v4 + variáveis CSS (OKLch)
├── core/                     # Código compartilhado
│   ├── components/ui/        # shadcn/ui (style new-york)
│   ├── components/layout/    # Sidebar, Header, PageContainer
│   ├── components/shared/    # CreditBar, EmptyState, LoadingScreen
│   ├── components/animations # Wrappers GSAP (FadeIn, SlideIn, ...)
│   ├── hooks/                # useAuth, useCredits
│   ├── entities/             # Interfaces TS (User, Flashcard, Question, ...)
│   ├── types/                # Tipos compartilhados
│   ├── constants/            # ROUTES, limites de upload, storage keys
│   ├── mocks/                # Dados mockados das entidades
│   └── lib/utils.ts          # cn() — clsx + tailwind-merge
└── features/                 # Módulos por feature
    └── <feature>/
        ├── types/
        └── views/            # Páginas e subcomponentes
```

---

## Convenções

- **Alias de import:** `@/*` aponta para `./src/*`
- **shadcn/ui:** `components → @/core/components`, `ui → @/core/components/ui`, `hooks → @/core/hooks`, `lib → @/core/lib`
- **Rotas:** sempre usar `ROUTES` em `@/core/constants` — nunca strings cruas
- **Auth:** baseado em `localStorage` (chave `"projeto-o:user"`), protegido em `(app)/layout.tsx`
- **Tema:** dark por padrão; light via classe `.light`. Cores em variáveis CSS OKLch
- **Animações:** GSAP via `useGSAP` (`@gsap/react`) e wrappers em `core/components/animations/`
- **Formulários:** React Hook Form + Zod
- **Toasts:** Sonner (`toast()`, `toast.success()`, `toast.error()`)

---

## Stack principal

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4** + **shadcn/ui** (new-york)
- **GSAP** para animações
- **React Hook Form** + **Zod** para formulários
- **Sonner** para toasts
- **TypeScript 5**

---

## Login mockado

Como ainda não há back-end conectado, o login aceita qualquer credencial válida pelo schema (e-mail + senha). O usuário é persistido em `localStorage` (`"projeto-o:user"`).

Para "deslogar", limpe a chave no DevTools ou use o botão de logout na sidebar.
