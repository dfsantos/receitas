import { Router } from 'express';
import {
  createRecipe,
  deleteRecipe,
  getRecipe,
  listRecipes,
  updateRecipe,
} from '../controllers/recipes.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';

export const recipesRouter = Router();

recipesRouter.get('/', asyncHandler(listRecipes));
recipesRouter.get('/:id', asyncHandler(getRecipe));
recipesRouter.post('/', asyncHandler(createRecipe));
recipesRouter.patch('/:id', asyncHandler(updateRecipe));
recipesRouter.delete('/:id', asyncHandler(deleteRecipe));
