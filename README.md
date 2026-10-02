# Receitas

CRUD completo de receitas culinarias: frontend em Vue 3 e API em Node/Express
com Prisma + SQLite, organizados como um monorepo com npm workspaces.

## Requisitos

- Node.js 22 (ver `.nvmrc`)

## Setup

```bash
npm install --workspaces --include-workspace-root

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

cd backend
npx prisma generate
npx prisma db push
npm run prisma:seed
cd ..
```

## Rodando em desenvolvimento

```bash
npm run dev
```

- Backend: http://localhost:3001 (`/api/recipes`, `/health`)
- Frontend: http://localhost:5173

## Scripts uteis

| Comando             | Descricao                              |
| ------------------- | -------------------------------------- |
| `npm run dev`       | backend + frontend em paralelo         |
| `npm run lint`      | ESLint nos dois workspaces             |
| `npm run typecheck` | checagem de tipos nos dois workspaces  |
| `npm run test`      | testes (Vitest) nos dois workspaces    |
| `npm run build`     | build de producao dos dois workspaces  |
| `npm run verify`    | format:check + lint + typecheck + test |

Para detalhes de arquitetura e convencoes do projeto, veja [`CLAUDE.md`](./CLAUDE.md).
