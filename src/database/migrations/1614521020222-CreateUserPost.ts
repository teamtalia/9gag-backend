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
        name: 'post_votes',
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
      'post_votes',
      new TableForeignKey({
        name: 'fk_join_posts_tags_tag',
        columnNames: ['tagId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tags',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'post_votes',
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
    await queryRunner.dropForeignKey('post_votes', 'fk_join_posts_votes_post');
    await queryRunner.dropForeignKey('post_votes', 'fk_join_posts_votes_vote');
    await queryRunner.dropTable('post_votes');
  }
}
