export async function up(db) {
    await db.schema
      .alterTable("carbon_footprint_calculator")
      .addColumn("reduced_time", "integer")
      .execute();
}
