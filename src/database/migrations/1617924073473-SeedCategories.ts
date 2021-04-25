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
