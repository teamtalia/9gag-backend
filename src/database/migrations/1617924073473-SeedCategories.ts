/* eslint-disable no-constant-condition */
import slugify from 'slugify';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { uniqueId } from 'lodash';
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

    await Promise.all(
      this.payload.map(category =>
        queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into('categories')
          .values({
            id: uniqueId(),
            name: category,
            slug: slugify(category.toLowerCase()),
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .execute(),
      ),
    );
  }

  public async down(_: QueryRunner): Promise<void> {
    // TODO
  }
}
