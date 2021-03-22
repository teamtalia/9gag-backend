import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddLevelFieldComments1614360484751 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'comments',
      new TableColumn({
        name: 'level',
        type: 'integer',
        isNullable: false,
        default: 0,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('comments', 'level');
  }
}
