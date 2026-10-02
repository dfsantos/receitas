# Receitas

App completo de CRUD de receitas culinarias. Monorepo com frontend em Vue 3 e
backend em Node/Express, usando npm workspaces.

## Stack

- **Frontend**: Vue 3 (Composition API + `<script setup>`), Vite, TypeScript,
  Vue Router, Pinia. Sem framework de CSS; estilos em `frontend/src/assets/main.css`
  usando variaveis CSS.
- **Backend**: Node + Express + TypeScript, Prisma ORM, SQLite (arquivo local,
  sem servidor externo), validacao de entrada com Zod.
- **Testes**: Vitest em ambos workspaces. Backend usa Supertest para testes de
  integracao da API contra um banco SQLite de teste. Frontend usa
  `@vue/test-utils` para testes de componentes/stores.

## Estrutura

```
receitas/
  backend/
    prisma/schema.prisma   # fonte da verdade do modelo de dados
    prisma/seed.ts         # dados de exemplo
    src/
      app.ts                # cria o app Express (sem listen) - usado nos testes
      index.ts               # entrypoint, faz listen
      routes/, controllers/, schemas/, middlewares/, lib/
    tests/                  # testes de integracao (Vitest + Supertest)
  frontend/
    src/
      main.ts, App.vue, router/, stores/, views/, components/, api/, types/
      **/__tests__/         # testes de componentes e stores (Vitest)
```

## Comandos

Execute a partir da raiz do repositorio (usa npm workspaces):

```bash
npm run dev              # backend (porta 3001) + frontend (porta 5173) em paralelo
npm run dev:backend      # so o backend
npm run dev:frontend     # so o frontend
npm run lint             # eslint em ambos workspaces
npm run typecheck        # tsc/vue-tsc em ambos workspaces
npm run test             # vitest em ambos workspaces
npm run build            # build de produção de ambos workspaces
npm run verify           # format:check + lint + typecheck + test (rodar antes de considerar uma tarefa concluida)
```

Comandos especificos do backend (dentro de `backend/`):

```bash
npx prisma generate            # regenerar o client apos mudar o schema
npx prisma db push              # aplicar o schema no SQLite local (dev)
npx prisma migrate dev --name x # criar uma migration versionada (quando necessario)
npm run prisma:seed             # popular o banco com receitas de exemplo
```

## Convencoes

- TypeScript em modo `strict` + `noUncheckedIndexedAccess` nos dois workspaces.
  Nao desative essas flags.
- Toda validacao de entrada da API fica nos schemas Zod em `backend/src/schemas`.
  Controllers nao devem confiar em dados nao validados do `req.body`/`req.query`.
- `backend/src/app.ts` exporta `createApp()` sem chamar `listen` para permitir
  testes de integracao com Supertest; `index.ts` e o unico lugar que faz `listen`.
- O schema do Prisma (`backend/prisma/schema.prisma`) e a fonte da verdade do
  modelo de dados. Qualquer mudanca de modelo deve vir acompanhada de
  `prisma generate` e, se for mudanca estrutural permanente, uma migration.
- Texto de interface (labels, mensagens de erro, conteudo) em portugues (pt-BR).
  Nomes de variaveis, funcoes e commits em ingles, seguindo o padrao do codigo.
- Toda alteracao em rotas ou regras de negocio do backend deve ter teste de
  integracao correspondente em `backend/tests/`.
- Testes de frontend usam mocks para `src/api/*` ao testar stores (ver
  `src/stores/__tests__/recipes.test.ts` como referencia) - nao fazer chamadas
  HTTP reais em testes.

## Banco de dados

SQLite via Prisma, arquivo versionado em `backend/prisma/dev.db` (ignorado pelo
git). `backend/.env` define `DATABASE_URL`; `backend/.env.test` define um banco
separado (`test.db`) usado pelos testes de integracao, recriado a cada run via
`prisma db push` (ver `backend/tests/global-setup.ts`).

## Antes de finalizar uma tarefa

Rode `npm run verify` na raiz. Se algo falhar, corrija antes de reportar a
tarefa como concluida.
