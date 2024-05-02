import { Kysely } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
// SolarPanelCalculation table
    await db.schema
        .createTable("solarpanelcalculation")
        .addColumn("calculation_id", "integer", (col) => col.autoIncrement().primaryKey())
        .addColumn("number_of_panels", "bigint")
        .addColumn("total_cost", "float")
        .addColumn("roi_percentage", "float")
        .addColumn("payback_period", "bigint")
        .execute();

    
}
/**
 * @param db {Kysely<any>}
 */

export async function down(db) {

  await db.schema.dropTableIfExists("SolarPanelCalculation");
}