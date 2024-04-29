import { Kysely } from "kysely";

/**
 * Sets up the database schema.
 * @param db {Kysely<any>}
 */
export async function up(db) {

 // SolarPanels table
 await db.schema
   .createTable('solar_panels')
   .addColumn('solar_panel_id', 'integer', (col) => col.autoIncrement().primaryKey())
   .addColumn('property_id', 'integer')
   .addColumn('contractor_id', 'integer', (col) => col.references('contractor.contractor_id'))
   .addColumn('consultant_id', 'integer', (col) => col.references('consultants.consultant_id'))
   .addColumn('installation_date', 'date', (col) => col.notNull())
   .addColumn('performance_metrics', 'text')
   .execute();

await db.schema
.alterTable("solar_panels")
.addForeignKeyConstraint(
    "solar_panels_property_fk",
    ['property_id'],
    "property",
    ['property_id']
)
.execute()
}

/**
 * Tears down the database schema.
 * @param db {Kysely<any>}
 */
export async function down(db) {
    await db.schema.dropTableIfExists('solar_panels');
}

