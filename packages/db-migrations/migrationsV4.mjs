export async function up(db) {
    // Insert data into Admin table
    await db
      .insertInto('admin')
      .values([
        { username: 'admin1', email: 'admin1@example.com', first_name: 'First', last_name: 'Admin' },
        { username: 'admin2', email: 'admin2@example.com', first_name: 'Second', last_name: 'Admin' }
      ])
      .execute();
  
    // Insert data into Customer table
    await db
      .insertInto('customer')
      .values([
        { first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', phone: 12345 },
        { first_name: 'Jane', last_name: 'Doe', email: 'jane.doe@example.com', phone: 98765 }
      ])
      .execute();
  
    // Insert data into Inquiry table
    await db
      .insertInto('inquiry')
      .values([
        { customer_id: 1, inquiry_content: 'How do I reset my password?' },
        { customer_id: 2, inquiry_content: 'What are your working hours?' }
      ])
      .execute();
  
    // Insert data into Property table
    await db
      .insertInto('property')
      .values([
            { customer_id: 1, longitude: '40.712776', latitude: '-74.005974', dimensions: '20x30', area_name: 'New York', address: '123 Broadway, New York, NY', subsidised: false, registration_method: 'Upload' },
            { customer_id: 2, longitude: '-118.243685', latitude: '34.052234', dimensions: '30x40', area_name: 'Los Angeles', address: '456 Sunset Blvd, Los Angeles, CA', subsidised: true, registration_method: 'Map' }
          ])
        .execute();
    await db
          .insertInto('ewabill')
          .values([
            { property_id: 1, issue_date: '2024-01-01', monthly_bill: 100, electricity_supply: 500, rate: 10, usage: 50 },
            { property_id: 2, issue_date: '2024-01-01', monthly_bill: 150, electricity_supply: 600, rate: 12, usage: 60 }
          ]).execute();
        }