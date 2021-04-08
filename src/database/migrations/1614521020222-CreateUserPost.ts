import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateUserPost1614521020222 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_posts',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'postId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'userId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'voted',
            type: 'boolean',
            isNullable: false,
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'user_posts',
      new TableForeignKey({
        name: 'fk_user_posts_posts',
        columnNames: ['postId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'posts',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'user_posts',
      new TableForeignKey({
        name: 'fk_user_posts_users',
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('user_posts', 'fk_user_posts_users');
    await queryRunner.dropForeignKey('user_posts', 'fk_user_posts_posts');
    await queryRunner.dropTable('user_posts');
  }
}
