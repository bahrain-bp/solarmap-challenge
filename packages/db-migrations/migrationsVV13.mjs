import { Kysely } from "kysely";

/**
 * Sets up the database schema.
 * @param db {Kysely<any>}
 */
export async function up(db) {

    await db.schema.dropTable('ewabill').execute();
await db.schema.dropTable('property').execute();

  // Property table
  await db.schema
    .createTable("property")
    .addColumn("property_id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("customer_id", "integer")
    .addColumn("longitude", "varchar(255)", (col) => col.notNull())
    .addColumn("latitude", "varchar(255)", (col) => col.notNull())
    .addColumn("dimensions", "varchar(255)")
    .addColumn("area_name", "varchar(255)")
    .addColumn("property_address", "varchar(255)", (col) => col.notNull())
    .execute();

  // EWAbill table
  await db.schema
    .createTable("ewabill")
    .addColumn("bill_id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("issue_date", "date", (col) => col.notNull())
    .addColumn("monthly_bill", "float", (col) => col.notNull())
    .addColumn("electricity_supply", "bigint", (col) => col.notNull())
    .addColumn("rate", "float", (col) => col.notNull())
    .addColumn("usage", "bigint", (col) => col.notNull())
    .addColumn("bill_address", "varchar(255)", (col) => col.notNull())
    .addColumn("subsidised", "boolean", (col) => col.notNull())
    .execute();

    //EWA Bill and Property Conjuction table
    await db.schema
    .createTable("ewabill_property")
    .addColumn("ewabill_property", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("bill_id", "integer")
    .addColumn("property_id", "integer")
    .execute();

    await db.schema
    .alterTable("property")
    .addForeignKeyConstraint(
        "property_customer_fk",
        ['customer_id'],
        "customer",
        ['customer_id']
    )
    .execute()
}

/**
 * Tears down the database schema.
 * @param db {Kysely<any>}
 */
export async function down(db) {
    await db.schema.dropTable('ewabill').execute();
await db.schema.dropTable('property').execute();
  await db.schema.dropTableIfExists('ewabill');
  await db.schema.dropTableIfExists('property');
  await db.schema.dropTableIfExists('ewabill_property');

}
