import { Kysely } from "kysely";

/**
 * Sets up the database schema.
 * @param db {Kysely<any>}
 */
export async function up(db) {
  // Existing table creation not shown for brevity...

  // Consultant table
  await db.schema
    .createTable("consultant")
    .addColumn("consultant_id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("level", "varchar(255)", (col) => col.notNull())
    .addColumn("crep_num", "varchar(255)", (col) => col.notNull())
    .addColumn("fax", "integer")
    .addColumn("contact_info", "varchar(255)")
    .execute();

  // Contractor table
  await db.schema
    .createTable("contractor")
    .addColumn("contractor_id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("level", "varchar(255)", (col) => col.notNull())
    .addColumn("license_num", "varchar(255)", (col) => col.notNull())
    .addColumn("fax", "integer")
    .addColumn("contact_info", "varchar(255)")
    .execute();

}

/**
 * Tears down the database schema.
 * @param db {Kysely<any>}
 */
async function down(db) {

  await db.schema.dropTableIfExists('consultant');
  await db.schema.dropTableIfExists('contractor');

}
