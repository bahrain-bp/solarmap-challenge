export async function up(db) {
    await db.schema.dropTable('subscription').execute();

    await db.schema
    .createTable("subscription")
      .addColumn("subscription_id", "integer", (col) => col.autoIncrement().primaryKey())
      .addColumn("first_name", "varchar(255)", (col) => col.notNull())
      .addColumn("last_name", "varchar(255)", (col) => col.notNull())
      .addColumn("email", "varchar(255)", (col) => col.notNull())
      .addColumn("phone", "varchar(255)", (col) => col.notNull())
      .execute();
   
    }