import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTags1607773541177 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tags',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'slug',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'icon',
            type: 'varchar',
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
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'tags',
      new TableForeignKey({
        name: 'fk_tag_icon',
        columnNames: ['icon'],
        referencedColumnNames: ['id'],
        referencedTableName: 'files',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('tags', 'fk_tag_icon');
    await queryRunner.dropTable('tags');
  }
}
