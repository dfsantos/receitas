#!/bin/bash
set -euo pipefail

cd "$CLAUDE_PROJECT_DIR"

npm install --workspaces --include-workspace-root

if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
fi

if [ ! -f backend/.env.test ]; then
  cat > backend/.env.test <<'EOF'
DATABASE_URL="file:./test.db"
PORT=3002
CORS_ORIGIN="http://localhost:5173"
EOF
fi

if [ ! -f frontend/.env ]; then
  cp frontend/.env.example frontend/.env
fi

(cd backend && npx prisma generate)
(cd backend && npx prisma db push --skip-generate)
