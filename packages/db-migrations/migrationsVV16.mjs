import { Kysely } from "kysely";

/**
 * Sets up the database schema.
 * @param db {Kysely<any>}
 */
export async function up(db) {
await db.schema.dropTable('inquiry').execute();

}


export async function down(db) {
await db.schema.dropTable('inquiry').execute();


}