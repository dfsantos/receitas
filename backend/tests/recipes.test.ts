import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import supertest from 'supertest';
import { createApp } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

const app = createApp();
const request = supertest(app);

const payload = {
  title: 'Torta de Limao',
  description: 'Torta gelada com cobertura de merengue.',
  category: 'SOBREMESA' as const,
  prepTimeMin: 45,
  servings: 10,
  ingredients: [{ name: 'Leite condensado', quantity: '1 lata' }],
  steps: [{ description: 'Misture os ingredientes e leve a geladeira.' }],
};

beforeEach(async () => {
  await prisma.step.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.recipe.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('CRUD de receitas', () => {
  it('cria e lista uma receita', async () => {
    const createResponse = await request.post('/api/recipes').send(payload);
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.title).toBe(payload.title);
    expect(createResponse.body.ingredients).toHaveLength(1);

    const listResponse = await request.get('/api/recipes');
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.total).toBe(1);
    expect(listResponse.body.items[0].title).toBe(payload.title);
  });

  it('busca uma receita por id', async () => {
    const created = await request.post('/api/recipes').send(payload);

    const response = await request.get(`/api/recipes/${created.body.id}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(created.body.id);
  });

  it('retorna 404 para receita inexistente', async () => {
    const response = await request.get('/api/recipes/id-inexistente');
    expect(response.status).toBe(404);
  });

  it('rejeita payload invalido', async () => {
    const response = await request.post('/api/recipes').send({ title: '' });
    expect(response.status).toBe(400);
  });

  it('atualiza uma receita', async () => {
    const created = await request.post('/api/recipes').send(payload);

    const response = await request
      .patch(`/api/recipes/${created.body.id}`)
      .send({ title: 'Torta de Limao Atualizada' });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Torta de Limao Atualizada');
  });

  it('remove uma receita', async () => {
    const created = await request.post('/api/recipes').send(payload);

    const deleteResponse = await request.delete(`/api/recipes/${created.body.id}`);
    expect(deleteResponse.status).toBe(204);

    const getResponse = await request.get(`/api/recipes/${created.body.id}`);
    expect(getResponse.status).toBe(404);
  });

  it('filtra receitas por categoria e busca', async () => {
    await request.post('/api/recipes').send(payload);
    await request.post('/api/recipes').send({
      ...payload,
      title: 'Feijoada',
      category: 'PRATO_PRINCIPAL',
    });

    const response = await request.get('/api/recipes').query({ category: 'SOBREMESA' });
    expect(response.body.total).toBe(1);
    expect(response.body.items[0].title).toBe('Torta de Limao');
  });
});
