import { Kysely } from "kysely";

/**
 * Sets up the database schema.
 * @param db {Kysely<any>}
 */
export async function up(db) {

 // SolarPanels table
 await db.schema
   .createTable('feedback')
   .addColumn('feedback_id', 'integer', (col) => col.autoIncrement().primaryKey())
   .addColumn("feedback_content", "varchar(2000)", (col) => col.notNull())
   .execute();


}

/**
 * Tears down the database schema.
 * @param db {Kysely<any>}
 */
export async function down(db) {
    await db.schema.dropTableIfExists('feedback');
}

