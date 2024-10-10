import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Admin1728531248441 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const Admin = new Table({
      name: 'admin',
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
      ],
    });

    await queryRunner.createTable(Admin, true);
    await queryRunner.query(`
            INSERT INTO admin (name, email)
            VALUES ('admin', 'admin@gmail.com')
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('admin', true);
  }
}
