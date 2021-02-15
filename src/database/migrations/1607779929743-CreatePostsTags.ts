import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreatePostsTags1607779929743 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'posts_tags',
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
            name: 'tagId',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'posts_tags',
      new TableForeignKey({
        name: 'fk_join_posts_tags_tag',
        columnNames: ['tagId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tags',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'posts_tags',
      new TableForeignKey({
        name: 'fk_join_posts_tags_post',
        columnNames: ['postId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'posts',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('posts_tags', 'fk_join_posts_tags_post');
    await queryRunner.dropForeignKey('posts_tags', 'fk_join_posts_tags_tag');
    await queryRunner.dropTable('posts_tags');
  }
}
