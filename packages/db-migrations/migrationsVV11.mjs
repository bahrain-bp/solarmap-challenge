import { Kysely } from "kysely";

/**
 * Sets up the database schema.
 * @param db {Kysely<any>}
 */
export async function up(db) {
 // SolarPanelCalculation table
//  await db.schema
//  .createTable('solar_panel_calculation')
//  .addColumn('calculation_id', 'integer', (col) => col.autoIncrement().primaryKey())
//  .addColumn('property_id', 'integer', (col) => col.notNull().references('property.property_id'))
//  .addColumn('number_of_panels', 'bigint', (col) => col.notNull())
//  .addColumn('total_cost', 'decimal', (col) => col.notNull())
//  .addColumn('roi_percentage', 'decimal', (col) => col.notNull())
//  .addColumn('payback_period', 'bigint', (col) => col.notNull())
//  .addColumn('solar_generation', 'bigint', (col) => col.notNull())
//  .execute();

// CarbonFootprintCalculator table
await db.schema
 .createTable('carbon_footprint_calculator')
 .addColumn('carbon_footprint_id', 'integer', (col) => col.autoIncrement().primaryKey())
 .addColumn('customer_id', 'integer', (col) => col.notNull().references('customer.customer_id'))
 .addColumn('ecological_footprint', 'bigint', (col) => col.notNull())
 .execute();

// CarbonCalculatorUsage table
await db.schema
 .createTable('carbon_calculator_usage')
 .addColumn('carbon_calculator_usage_id', 'integer', (col) => col.autoIncrement().primaryKey())
 .addColumn('customer_id', 'integer', (col) => col.notNull().references('customer.customer_id'))
 .addColumn('carbon_footprint_id', 'bigint', (col) => col.notNull().references('carbon_footprint_calculator.carbon_footprint_id'))
 .addColumn('date_used', 'datetime', (col) => col.notNull())
 .execute();

// // SolarCalculatorUsage table
// await db.schema
//  .createTable('solar_calculator_usage')
//  .addColumn('solar_calculator_usage_id', 'integer', (col) => col.autoIncrement().primaryKey())
//  .addColumn('customer_id', 'integer', (col) => col.notNull().references('customer.customer_id'))
//  .addColumn('calculation_id', 'integer', (col) => col.notNull().references('solar_panel_calculation.calculation_id'))
//  .addColumn('date_used', 'datetime', (col) => col.notNull())
//  .execute();

// Message table
await db.schema
 .createTable('message')
 .addColumn('message_id', 'integer', (col) => col.autoIncrement().primaryKey())
 .addColumn('customer_id', 'integer', (col) => col.notNull().references('customer.customer_id'))
 .addColumn('message_type', 'varchar(255)', (col) => col.notNull()) // Inquiry, Suggestion, Complaint
 .addColumn('subject', 'varchar(255)', (col) => col.notNull())
 .addColumn('message', 'text', (col) => col.notNull())
 .execute();

  //  // SolarPanelRecommendation table
  //  await db.schema
  //  .createTable('solar_panel_recommendation')
  //  .addColumn('recommendation_id', 'integer', (col) => col.autoIncrement().primaryKey())
  //  .addColumn('customer_id', 'integer', (col) => col.notNull().references('customer.customer_id'))
  //  .addColumn('calculation_id', 'integer', (col) => col.notNull().references('solar_panel_calculation.calculation_id'))
  //  .addColumn('recommended_panels', 'varchar(255)', (col) => col.notNull())
  //  .addColumn('contractor_id', 'integer', (col) => col.references('contractor.contractor_id'))
  //  .addColumn('consultant_id', 'integer', (col) => col.references('consultants.consultant_id'))
  //  .execute();

//  // SolarPanels table
//  await db.schema
//    .createTable('solar_panels')
//    .addColumn('solar_panel_id', 'integer', (col) => col.autoIncrement().primaryKey())
//    .addColumn('property_id', 'integer', (col) => col.notNull().references('property.property_id'))
//    .addColumn('contractor_id', 'integer', (col) => col.references('contractor.contractor_id'))
//    .addColumn('consultant_id', 'integer', (col) => col.references('consultants.consultant_id'))
//    .addColumn('installation_date', 'date', (col) => col.notNull())
//    .addColumn('performance_metrics', 'text')
//    .execute();

//  // PerformanceMetrics table
//  await db.schema
//    .createTable('performance_metrics')
//    .addColumn('metric_id', 'integer', (col) => col.autoIncrement().primaryKey())
//    .addColumn('solar_panel_id', 'integer', (col) => col.notNull().references('solar_panels.solar_panel_id'))
//    .addColumn('date_recorded', 'datetime', (col) => col.notNull())
//    .addColumn('performance_data', 'varchar(255)', (col) => col.notNull())
//    .execute();

}

/**
 * Tears down the database schema.
 * @param db {Kysely<any>}
 */
export async function down(db) {
    // await db.schema.dropTableIfExists('performance_metrics');
    // await db.schema.dropTableIfExists('solar_panels');
    // await db.schema.dropTableIfExists('solar_panel_recommendation');
    await db.schema.dropTableIfExists('message');
    // await db.schema.dropTableIfExists('solar_calculator_usage');
    await db.schema.dropTableIfExists('carbon_calculator_usage');
    await db.schema.dropTableIfExists('carbon_footprint_calculator');
    // await db.schema.dropTableIfExists('solar_panel_calculation');
}
