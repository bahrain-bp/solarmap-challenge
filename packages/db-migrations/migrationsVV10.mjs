export async function up(db) {
    await db
  .insertInto('customer')
  .values([
    { first_name: 'Jill', last_name: 'Hart', email: 'jill@example.com', phone: 12345 },
    { first_name: 'Marry', last_name: 'Cain', email: 'MC@example.com', phone: 23456 },
    { first_name: 'Alice', last_name: 'Johnson', email: 'alice.johnson@example.com', phone: 34567 },
    { first_name: 'Bob', last_name: 'Brown', email: 'bob.brown@example.com', phone: 45678 },
    { first_name: 'Carol', last_name: 'Davis', email: 'carol.davis@example.com', phone: 5678 },
    { first_name: 'David', last_name: 'Wilson', email: 'david.wilson@example.com', phone: 6789 },
    { first_name: 'Eve', last_name: 'Moore', email: 'eve.moore@example.com', phone: 7890 },
    { first_name: 'Frank', last_name: 'Taylor', email: 'frank.taylor@example.com', phone: 8901 },
    { first_name: 'Grace', last_name: 'Anderson', email: 'grace.anderson@example.com', phone: 9013 },
    { first_name: 'Henry', last_name: 'Thomas', email: 'henry.thomas@example.com', phone: 1234 }
  ])
  .execute();

  await db
  .insertInto('inquiry')
  .values([
    { customer_id: 1, inquiry_content: 'What are the efficiency ratings of your solar panels?' },
    { customer_id: 2, inquiry_content: 'Can you provide a quote for a 5kW solar panel system?' },
    { customer_id: 3, inquiry_content: 'Are there any government rebates available for installing solar panels?' },
    { customer_id: 4, inquiry_content: 'What is the estimated lifespan of your solar panels?' },
    { customer_id: 5, inquiry_content: 'Do you offer installation services for residential properties?' },
    { customer_id: 6, inquiry_content: 'What are the maintenance requirements for solar panels?' },
    { customer_id: 7, inquiry_content: 'Can solar panels be installed on a flat roof?' },
    { customer_id: 8, inquiry_content: 'How do I monitor the performance of my solar panels?' },
    { customer_id: 9, inquiry_content: 'What financing options are available for purchasing solar panels?' },
    { customer_id: 10, inquiry_content: 'Do you provide warranties or guarantees with your solar pane installations?' }
  ])
  .execute();

}
