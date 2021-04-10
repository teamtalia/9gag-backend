import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTimestampToUserPosts1618011109051
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('user_posts', [
      new TableColumn({
        name: 'created_at',
        type: 'timestamp with time zone',
        isNullable: false,
      }),
      new TableColumn({
        name: 'updated_at',
        type: 'timestamp with time zone',
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_posts', 'updated_at');
    await queryRunner.dropColumn('user_posts', 'created_at');
  }
}
