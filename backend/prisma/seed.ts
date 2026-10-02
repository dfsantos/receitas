import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.step.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.recipe.deleteMany();

  await prisma.recipe.create({
    data: {
      title: 'Bolo de Cenoura com Cobertura de Chocolate',
      description: 'Bolo fofinho de cenoura com cobertura cremosa de chocolate.',
      category: 'SOBREMESA',
      prepTimeMin: 60,
      servings: 8,
      ingredients: {
        create: [
          { name: 'Cenoura media', quantity: '3 unidades', order: 0 },
          { name: 'Acucar', quantity: '2 xicaras', order: 1 },
          { name: 'Oleo', quantity: '1 xicara', order: 2 },
          { name: 'Ovos', quantity: '3 unidades', order: 3 },
          { name: 'Farinha de trigo', quantity: '2 xicaras', order: 4 },
          { name: 'Fermento em po', quantity: '1 colher de sopa', order: 5 },
          { name: 'Chocolate em po', quantity: '4 colheres de sopa', order: 6 },
        ],
      },
      steps: {
        create: [
          {
            description: 'Bata a cenoura, o acucar, o oleo e os ovos no liquidificador.',
            order: 0,
          },
          { description: 'Misture a farinha e o fermento e junte a mistura liquida.', order: 1 },
          { description: 'Asse em forma untada por 40 minutos a 180 graus.', order: 2 },
          { description: 'Prepare a cobertura de chocolate e cubra o bolo ainda morno.', order: 3 },
        ],
      },
    },
  });

  await prisma.recipe.create({
    data: {
      title: 'Feijoada Simplificada',
      description: 'Versao rapida da feijoada tradicional brasileira.',
      category: 'PRATO_PRINCIPAL',
      prepTimeMin: 90,
      servings: 6,
      ingredients: {
        create: [
          { name: 'Feijao preto', quantity: '500g', order: 0 },
          { name: 'Carne seca', quantity: '300g', order: 1 },
          { name: 'Linguica', quantity: '200g', order: 2 },
          { name: 'Alho', quantity: '3 dentes', order: 3 },
          { name: 'Cebola', quantity: '1 unidade', order: 4 },
        ],
      },
      steps: {
        create: [
          { description: 'Deixe o feijao e a carne seca de molho na vespera.', order: 0 },
          { description: 'Cozinhe o feijao na pressao por 30 minutos.', order: 1 },
          { description: 'Refogue as carnes com alho e cebola e junte ao feijao.', order: 2 },
          { description: 'Cozinhe em fogo baixo por 30 minutos e sirva.', order: 3 },
        ],
      },
    },
  });

  console.log('Seed concluido.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
