# MedBrain — Back-end

API do MedBrain construída com **Fastify 5**, **TypeScript**, **Drizzle ORM** e **PostgreSQL**. Documentação OpenAPI gerada automaticamente via Swagger UI.

---

## Pré-requisitos

- **Node.js** 20 ou superior
- **pnpm** 10 (versão fixada no `package.json` via `packageManager`)
- **Docker** e **Docker Compose** (para subir o PostgreSQL localmente)

Verifique as versões:

```bash
node -v
pnpm -v
docker -v
```

Se não tiver o pnpm:

```bash
npm install -g pnpm@10
```

---

## Variáveis de ambiente

O projeto já vem com um arquivo `.env` versionado para desenvolvimento local:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=med_app
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/med_app
```

Estas variáveis são consumidas tanto pelo `docker-compose.yml` quanto pela aplicação (Drizzle e plugin de DB).

---

## Como rodar

Todos os comandos devem ser executados **dentro do diretório `back-end/`**.

### 1. Instalar dependências

```bash
cd back-end
pnpm install
```

### 2. Subir o banco de dados (PostgreSQL via Docker)

```bash
docker compose up -d
```

Isso sobe um container `mad-brain-postgres` na porta **5432** com volume persistente (`postgres-data`).

Para parar o banco:

```bash
docker compose down
```

Para apagar tudo (inclusive os dados):

```bash
docker compose down -v
```

### 3. Aplicar migrations

Com o banco já em pé, gere/aplique o schema com Drizzle Kit:

```bash
# Aplica as migrations existentes no banco
pnpm db:migrage

# (ou) Sincroniza o schema atual diretamente, sem gerar migration
pnpm db:push
```

> Para criar uma nova migration após alterar `src/db/schema.ts`:
>
> ```bash
> pnpm db:generate
> ```

### 4. Subir a API em modo dev

```bash
pnpm dev
```

A API ficará disponível em:

```
http://localhost:3333
```

A documentação Swagger fica em:

```
http://localhost:3333/docs
```

---

## Scripts disponíveis

| Comando            | O que faz                                                  |
| ------------------ | ---------------------------------------------------------- |
| `pnpm dev`         | Sobe o servidor com `tsx watch` (hot reload + `.env`)      |
| `pnpm start`       | Roda o build de produção (`node dist/server.js`)           |
| `pnpm db:generate` | Gera uma nova migration a partir do schema                 |
| `pnpm db:migrage`  | Aplica as migrations pendentes no banco                    |
| `pnpm db:push`     | Faz push direto do schema (sem migration formal)           |

---

## Estrutura de pastas

```
back-end/
├── docker-compose.yml        # PostgreSQL local
├── drizzle.config.ts         # Config do Drizzle Kit (snake_case)
├── drizzle/                  # Migrations SQL geradas
├── .env                      # Credenciais locais (dev)
└── src/
    ├── server.ts             # Entrypoint (porta 3333)
    ├── app.ts                # Factory do Fastify (CORS, Swagger, plugins, rotas)
    ├── db/
    │   └── schema.ts         # Schema Drizzle (Postgres)
    ├── lib/                  # Utilitários
    ├── plugins/
    │   └── db.plugin.ts      # Plugin Fastify que injeta o DB no app
    └── modules/
        └── users/            # Módulos por domínio
            ├── users.plugin.ts
            └── users.router.ts
```

Cada módulo segue a convenção:

1. **`*.plugin.ts`** — registra services/controllers no `app.<modulo>`
2. **`*.router.ts`** — declara as rotas e consome o controller injetado

---

## Stack principal

- **Fastify 5** — servidor HTTP
- **fastify-type-provider-zod** — validação/serialização com Zod
- **@fastify/swagger** + **@fastify/swagger-ui** — OpenAPI / Swagger UI
- **Drizzle ORM** + **drizzle-kit** — ORM e migrations
- **PostgreSQL 16** (via Docker)
- **pg** — driver oficial
- **uuidv7** — geração de IDs
- **tsx** — execução TypeScript em dev

---

## Endpoints

- `GET /` → healthcheck (`{ hello: "world" }`)
- `GET /docs` → Swagger UI
- `*  /users/*` → rotas do módulo de usuários

> A lista completa de rotas vive em `/docs` (Swagger gera tudo a partir dos schemas Zod).

---

## CORS

Hoje, o CORS está liberado apenas para:

```
http://localhost:5173
```

Se o front-end estiver rodando em outra porta (ex.: `3000` do Next.js), ajuste o `origin` em `src/app.ts`.

---

## Troubleshooting

**`ECONNREFUSED 127.0.0.1:5432`**  
O Postgres não está rodando. Execute `docker compose up -d` antes de `pnpm dev`.

**Migrations não aplicaram**  
Confirme que o `DATABASE_URL` do `.env` aponta para o container e rode novamente `pnpm db:migrage`.

**Porta 3333 em uso**  
Encerre o processo que está usando a porta ou altere `port` em `src/server.ts`.
