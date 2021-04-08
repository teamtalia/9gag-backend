import { MigrationInterface, QueryRunner } from 'typeorm';
import Category from '../../models/Category';

export class SeedCategories1617924073473 implements MigrationInterface {
  payload = [
    { name: 'abrobinha', slug: 'abro' },
    { name: 'Feijao', slug: 'feij' },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    const categoryRepository = queryRunner.manager.getRepository(Category);

    await categoryRepository.create(this.payload);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const categoryRepository = queryRunner.manager.getRepository(Category);
    await (await categoryRepository.find()).map(async category =>
      categoryRepository.delete(category),
    );
  }
}
