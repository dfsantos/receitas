import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { NotFoundError } from '../lib/http-error.js';
import {
  createRecipeSchema,
  listRecipesQuerySchema,
  updateRecipeSchema,
} from '../schemas/recipe.schema.js';
import type { Prisma } from '@prisma/client';

const recipeInclude = {
  ingredients: { orderBy: { order: 'asc' } },
  steps: { orderBy: { order: 'asc' } },
} satisfies Prisma.RecipeInclude;

export async function listRecipes(req: Request, res: Response) {
  const query = listRecipesQuerySchema.parse(req.query);
  const where: Prisma.RecipeWhereInput = {
    ...(query.category ? { category: query.category } : {}),
    ...(query.search
      ? {
          OR: [{ title: { contains: query.search } }, { description: { contains: query.search } }],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      include: recipeInclude,
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.recipe.count({ where }),
  ]);

  res.json({
    items,
    total,
    page: query.page,
    pageSize: query.pageSize,
    totalPages: Math.ceil(total / query.pageSize),
  });
}

export async function getRecipe(req: Request, res: Response) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: req.params.id },
    include: recipeInclude,
  });

  if (!recipe) {
    throw new NotFoundError(`Receita ${req.params.id} nao encontrada`);
  }

  res.json(recipe);
}

export async function createRecipe(req: Request, res: Response) {
  const input = createRecipeSchema.parse(req.body);

  const recipe = await prisma.recipe.create({
    data: {
      title: input.title,
      description: input.description,
      category: input.category,
      prepTimeMin: input.prepTimeMin,
      servings: input.servings,
      imageUrl: input.imageUrl || null,
      ingredients: {
        create: input.ingredients.map((ingredient, index) => ({
          ...ingredient,
          order: index,
        })),
      },
      steps: {
        create: input.steps.map((step, index) => ({
          ...step,
          order: index,
        })),
      },
    },
    include: recipeInclude,
  });

  res.status(201).json(recipe);
}

export async function updateRecipe(req: Request, res: Response) {
  const input = updateRecipeSchema.parse(req.body);
  const existing = await prisma.recipe.findUnique({ where: { id: req.params.id } });

  if (!existing) {
    throw new NotFoundError(`Receita ${req.params.id} nao encontrada`);
  }

  const recipe = await prisma.recipe.update({
    where: { id: req.params.id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.category !== undefined ? { category: input.category } : {}),
      ...(input.prepTimeMin !== undefined ? { prepTimeMin: input.prepTimeMin } : {}),
      ...(input.servings !== undefined ? { servings: input.servings } : {}),
      ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl || null } : {}),
      ...(input.ingredients !== undefined
        ? {
            ingredients: {
              deleteMany: {},
              create: input.ingredients.map((ingredient, index) => ({
                ...ingredient,
                order: index,
              })),
            },
          }
        : {}),
      ...(input.steps !== undefined
        ? {
            steps: {
              deleteMany: {},
              create: input.steps.map((step, index) => ({
                ...step,
                order: index,
              })),
            },
          }
        : {}),
    },
    include: recipeInclude,
  });

  res.json(recipe);
}

export async function deleteRecipe(req: Request, res: Response) {
  const existing = await prisma.recipe.findUnique({ where: { id: req.params.id } });

  if (!existing) {
    throw new NotFoundError(`Receita ${req.params.id} nao encontrada`);
  }

  await prisma.recipe.delete({ where: { id: req.params.id } });
  res.status(204).send();
}
