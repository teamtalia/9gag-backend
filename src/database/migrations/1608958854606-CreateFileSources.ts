import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateFileSources1608958854606 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'file_sources',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'tag',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'fileId',
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
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'file_sources',
      new TableForeignKey({
        name: 'fk_file_sources_file',
        columnNames: ['fileId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'files',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('file_sources', 'fk_file_sources_file');
    await queryRunner.dropTable('file_sources');
  }
}
