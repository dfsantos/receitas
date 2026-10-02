import { execSync } from 'node:child_process';
import { config } from 'dotenv';

export default function globalSetup() {
  config({ path: '.env.test' });
  execSync('npx prisma db push --skip-generate', {
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
    stdio: 'inherit',
  });
}
