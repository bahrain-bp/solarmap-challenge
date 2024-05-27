export async function up(db) {
    await db.schema
      .alterTable("educational_resource")
      .addColumn("created_at", "DATETIME")
      .addColumn("editted_at", "DATETIME" )
      .execute();
}
