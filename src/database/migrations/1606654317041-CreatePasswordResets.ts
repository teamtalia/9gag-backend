import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreatePasswordResets1606654317041 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'password_resets',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'code',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'userId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'expire_at',
            type: 'timestamp with time zone',
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
      'password_resets',
      new TableForeignKey({
        name: 'pk_password_resets_user',
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'password_resets',
      'pk_password_resets_user',
    );
    await queryRunner.dropTable('password_resets');
  }
}
