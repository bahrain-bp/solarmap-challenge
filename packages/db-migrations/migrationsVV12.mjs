import { Kysely } from "kysely";

/**
 * Sets up the database schema.
 * @param db {Kysely<any>}
 */
export async function up(db) {
await db.schema.dropTable('ewabill').execute();
await db.schema.dropTable('property').execute();
}


export async function down(db) {
await db.schema.dropTable('ewabill').execute();
await db.schema.dropTable('property').execute();

}