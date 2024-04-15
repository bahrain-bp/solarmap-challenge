export async function up(db) {

    //ORDER IS IMPORTANT DO NOT CHANGE
    await db.schema.dropTable("media").execute();
    await db.schema.dropTable("health_check").execute();
    await db.schema.dropTable("violations").execute();
    await db.schema.dropTable("payment").execute();
    await db.schema.dropTable("ticket").execute();
    await db.schema.dropTable("park").execute();
    await db.schema.dropTable("parking_area").execute();
    await db.schema.dropTable("device").execute();
    await db.schema.dropTable("authorized_drivers").execute();
    await db.schema.dropTable("vehicle").execute();
    await db.schema.dropTable("user").execute();
  }
  export async function down(db) {

    //ORDER IS IMPORTANT DO NOT CHANGE
    await db.schema.dropTable("media").execute();
    await db.schema.dropTable("health_check").execute();
    await db.schema.dropTable("violations").execute();
    await db.schema.dropTable("payment").execute();
    await db.schema.dropTable("ticket").execute();
    await db.schema.dropTable("park").execute();
    await db.schema.dropTable("parking_area").execute();
    await db.schema.dropTable("device").execute();
    await db.schema.dropTable("authorized_drivers").execute();
    await db.schema.dropTable("vehicle").execute();
    await db.schema.dropTable("user").execute();
  }
  