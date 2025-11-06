import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnIsActiveToCategories1762393544537
  implements MigrationInterface
{
  name = 'AddColumnIsActiveToCategories1762393544537';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "isActive" boolean NOT NULL DEFAULT true`,
    );
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
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "isActive"`);
  }
}
