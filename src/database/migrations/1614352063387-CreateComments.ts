import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateComments1614352063387 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'comments',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'text',
            type: 'varchar',
            isNullable: false,
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
            name: 'edited',
            type: 'boolean',
            isNullable: true,
            default: false,
          },
          {
            name: 'postId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'replyId',
            type: 'varchar',
            isNullable: true,
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
      'comments',
      new TableForeignKey({
        name: 'fk_comments_posts',
        columnNames: ['postId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'posts',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'comments',
      new TableForeignKey({
        name: 'fk_comments_comments',
        columnNames: ['replyId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'comments',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'comments',
      new TableForeignKey({
        name: 'fk_comments_users',
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('comments', 'fk_comments_posts');
    await queryRunner.dropForeignKey('comments', 'fk_comments_comments');
    await queryRunner.dropForeignKey('comments', 'fk_comments_users');
    await queryRunner.dropTable('comments');
  }
}
