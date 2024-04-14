import { Kysely } from "kysely";

/**
 * Sets up the database schema.
 * @param db {Kysely<any>}
 */
export async function up(db) {
  // Admin table
  await db.schema
    .createTable("admin")
    .addColumn("admin_id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("username", "varchar(255)", (col) => col.notNull())
    .addColumn("email", "varchar(255)", (col) => col.notNull())
    .addColumn("first_name", "varchar(255)", (col) => col.notNull())
    .addColumn("last_name", "varchar(255)", (col) => col.notNull())
    .execute();

  // Customer table
  await db.schema
    .createTable("customer")
    .addColumn("customer_id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("first_name", "varchar(255)", (col) => col.notNull())
    .addColumn("last_name", "varchar(255)", (col) => col.notNull())
    .addColumn("email", "varchar(255)", (col) => col.notNull())
    .addColumn("phone", "integer", (col) => col.notNull())
    .execute();

  // Inquiry table
  await db.schema
    .createTable("inquiry")
    .addColumn("inquiry_id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("customer_id", "integer", (col) => col.notNull().references("customer.customer_id"))
    .addColumn("inquiry_content", "varchar(255)", (col) => col.notNull())
    .execute();

  // Property table
  await db.schema
    .createTable("property")
    .addColumn("property_id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("customer_id", "integer", (col) => col.notNull().references("customer.customer_id"))
    .addColumn("longitude", "varchar(255)", (col) => col.notNull())
    .addColumn("latitude", "varchar(255)", (col) => col.notNull())
    .addColumn("dimensions", "varchar(255)")
    .addColumn("area_name", "varchar(255)")
    .addColumn("address", "varchar(255)", (col) => col.notNull())
    .addColumn("subsidised", "boolean", (col) => col.notNull())
    .addColumn("registration_method", "varchar(255)", (col) => col.notNull())
    .execute();

  // EWAbill table
  await db.schema
    .createTable("ewabill")
    .addColumn("bill_id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("property_id", "integer", (col) => col.notNull().references("property.property_id"))
    .addColumn("issue_date", "date", (col) => col.notNull())
    .addColumn("monthly_bill", "integer", (col) => col.notNull())
    .addColumn("electricity_supply", "integer", (col) => col.notNull())
    .addColumn("rate", "integer", (col) => col.notNull())
    .addColumn("usage", "integer", (col) => col.notNull())
    .execute();
}

/**
 * Tears down the database schema.
 * @param db {Kysely<any>}
 */
async function down(db) {
  await db.schema.dropTableIfExists('ewabill');
  await db.schema.dropTableIfExists('property');
  await db.schema.dropTableIfExists('inquiry');
  await db.schema.dropTableIfExists('customer');
  await db.schema.dropTableIfExists('admin');
}
