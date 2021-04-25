/* eslint-disable no-constant-condition */
import slugify from 'slugify';
import { MigrationInterface, QueryRunner } from 'typeorm';
import Category from '../../models/Category';

export class SeedCategories1617924073473 implements MigrationInterface {
  payload = [
    'MITOLOGIA',
    'MODA/BELEZA',
    'ESPORTES',
    'FILMES/SÉRIES',
    'CORONAVIRUS',
    'ENGRAÇADO',
    'JOGOS',
    'MÚSICA',
    'COMIDAS',
    'VIAGENS',
    'CARROS',
    'ANIMAIS',
    'POLÍTICA',
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    let times = 0;
    let categoryRepository;
    while (true) {
      try {
        categoryRepository = queryRunner.manager.getRepository(Category);
        break;
      } catch (e) {
        times += 1;
        if (times === 3) {
          throw new Error('Cannot get category repository');
        }
        // eslint-disable-next-line no-await-in-loop
        await new Promise(resolve => setTimeout(() => resolve(), 3000));
      }
    }

    await categoryRepository.save(
      this.payload.map(name => ({
        name,
        slug: slugify(name.toLowerCase()),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    );
  }

  public async down(_: QueryRunner): Promise<void> {
    // TODO
  }
}
