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
    const categoryRepository = await queryRunner.manager.getRepository(
      Category,
    );

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
