import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1762393144134 implements MigrationInterface {
  name = 'InitialMigration1762393144134';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "price" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" ALTER COLUMN "subTotal" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" ALTER COLUMN "iva" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" ALTER COLUMN "discount" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" ALTER COLUMN "shippingFees" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "total" TYPE numeric`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "total" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" ALTER COLUMN "shippingFees" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" ALTER COLUMN "discount" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" ALTER COLUMN "iva" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" ALTER COLUMN "subTotal" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "price" TYPE numeric`,
    );
  }
}
