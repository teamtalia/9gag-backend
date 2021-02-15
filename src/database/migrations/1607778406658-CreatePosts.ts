import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreatePosts1607778406658 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'posts',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'originalPoster',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'sensitive',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            isNullable: false,
          },
          {
            name: 'fileId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'userId',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'posts',
      new TableForeignKey({
        name: 'fk_posts_users',
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'posts',
      new TableForeignKey({
        name: 'fk_posts_files',
        columnNames: ['fileId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'files',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('posts', 'fk_posts_files');
    await queryRunner.dropForeignKey('posts', 'fk_posts_users');
    await queryRunner.dropTable('posts');
  }
}
