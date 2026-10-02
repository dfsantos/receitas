import { z } from 'zod';

export const categoryValues = [
  'CAFE_DA_MANHA',
  'ENTRADA',
  'PRATO_PRINCIPAL',
  'SOBREMESA',
  'LANCHE',
  'BEBIDA',
  'OUTRO',
] as const;

const ingredientSchema = z.object({
  name: z.string().trim().min(1, 'Nome do ingrediente e obrigatorio'),
  quantity: z.string().trim().min(1, 'Quantidade e obrigatoria'),
});

const stepSchema = z.object({
  description: z.string().trim().min(1, 'Descricao do passo e obrigatoria'),
});

export const createRecipeSchema = z.object({
  title: z.string().trim().min(1, 'Titulo e obrigatorio').max(200),
  description: z.string().trim().min(1, 'Descricao e obrigatoria'),
  category: z.enum(categoryValues),
  prepTimeMin: z.number().int().positive('Tempo de preparo deve ser positivo'),
  servings: z.number().int().positive('Numero de porcoes deve ser positivo'),
  imageUrl: z.string().trim().url().optional().or(z.literal('')),
  ingredients: z.array(ingredientSchema).min(1, 'Informe ao menos um ingrediente'),
  steps: z.array(stepSchema).min(1, 'Informe ao menos um passo'),
});

export const updateRecipeSchema = createRecipeSchema.partial();

export const listRecipesQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: z.enum(categoryValues).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(12),
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
export type ListRecipesQuery = z.infer<typeof listRecipesQuerySchema>;
