import { Kysely } from "kysely";

/**
 * Sets up the database schema.
 * @param db {Kysely<any>}
 */
export async function up(db) {
await db.schema.dropTable('solar_panels').execute();
await db.schema
.createTable('solar_panels')
.addColumn('solarpanel_id', 'integer', (col) => col.autoIncrement().primaryKey())
.addColumn('owner_name', "varchar(255)", (col) => col.notNull())
.addColumn('installation_address', "varchar(255)", (col) => col.notNull())
.addColumn('installation_coord', "varchar(255)", (col) => col.notNull())
.addColumn('number_of_panel', "bigint", (col) => col.notNull())
.addColumn('installation_date', "date", (col) => col.notNull())


.execute();
}