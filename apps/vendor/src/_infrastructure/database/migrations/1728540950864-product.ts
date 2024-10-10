import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Product1728540950864 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const product = new Table({
      name: 'product',
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
          name: 'stock',
          type: 'int',
          isNullable: false,
        },
        {
          name: 'vendor_id',
          type: 'int',
          isNullable: false,
          unsigned: true,
        },
      ],
    });
    await queryRunner.createTable(product, true);

    await queryRunner.createForeignKey(
      'product',
      new TableForeignKey({
        columnNames: ['vendor_id'],
        referencedColumnNames: ['id'],
        name: 'product_vendor_id_fkey',
        referencedTableName: 'vendor',
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('product', true);
  }
}
