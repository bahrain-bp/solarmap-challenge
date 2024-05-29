
export async function up(db) {
    await db.schema.dropTable('educational_resource').execute();

  await db.schema
    .createTable("educational_resource")
    .addColumn("resource_id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("title", "varchar(255)", (col) => col.notNull())
    .addColumn("body", "varchar(255)", (col) => col.notNull())
    .addColumn("resource_url", "varchar(255)", (col) => col.notNull())
    .addColumn("resource_img", "varchar(2100)")
    .addColumn("created_at", "DATETIME", (col) => col.notNull())
    .addColumn("editted_at", "DATETIME", (col) => col.notNull() )
    .execute();
}
