import { Kysely } from "kysely";

/**
 * Sets up the database schema.
 * @param db {Kysely<any>}
 */
export async function up(db) {

  await db.schema
    .createTable("educational_resource")
    .addColumn("resource_id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("title", "varchar(255)", (col) => col.notNull())
    .addColumn("body", "varchar(255)", (col) => col.notNull())
    .addColumn("resource_url", "varchar(255)", (col) => col.notNull())
    .addColumn("resource_img", "blob")
    .execute();
}

/**
 * Tears down the database schema.
 * @param db {Kysely<any>}
 */
export async function down(db) {

  await db.schema.dropTableIfExists('educational_resource');

}
