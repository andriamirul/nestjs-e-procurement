import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Vendor1728540887866 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const vendor = new Table({
      name: 'vendor',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          unsigned: true,
          generationStrategy: 'increment',
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
          isNullable: false,
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
          isNullable: false,
        },
        {
          name: 'name',
          type: 'varchar',
          length: '255',
          isNullable: false,
        },
        {
          name: 'email',
          type: 'varchar',
          length: '255',
          isNullable: false,
          isUnique: true,
        },
        {
          name: 'status',
          type: 'varchar',
          length: '255',
          isNullable: false,
          isUnique: true,
        },
      ],
    });

    await queryRunner.createTable(vendor, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('vendor', true);
  }
}
