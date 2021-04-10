import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAboutToUser1618012072629 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'about',
        isNullable: true,
        type: 'text',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'about');
  }
}
