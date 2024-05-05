import { Kysely } from "kysely";

/**
 * Sets up the database schema.
 * @param db {Kysely<any>}
 */
export async function up(db) {

 // SolarPanels table
 await db.schema
   .createTable('inquiry')
   .addColumn('inquiry_id', 'integer', (col) => col.autoIncrement().primaryKey())
   .addColumn('customer_id', 'integer')
   .addColumn("inquiry_content", "varchar(255)", (col) => col.notNull())
   .execute();

await db.schema
.alterTable("inquiry")
.addForeignKeyConstraint(
    "inquiry_customer_fk",
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
    await db.schema.dropTableIfExists('inquiry');
}

