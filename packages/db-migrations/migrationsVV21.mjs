/**
 * Sets up the database schema.
 * @param db {Kysely<any>}
 */
export async function up(db) {
  
  await db.schema
  .createTable("subscription")
    .addColumn("subscription_id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("email", "varchar(255)", (col) => col.notNull())
    .addColumn("phone", "integer", (col) => col.notNull())
    .execute();
 
  }

  /**
 * Tears down the database schema.
 * @param db {Kysely<any>}
 */
export async function down(db) {

  await db.schema.dropTableIfExists('subscription');

}