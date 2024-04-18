export const handler = async (event: any): Promise<any> => {
    try {
      // Extract message body from the SQS event
      const records = event.Records;
      for (const record of records) {
        const messageBody = JSON.parse(record.body);
  
        // Extract extractedText from the message body
        const extractedText = messageBody.extractedText;
  
        // Check if extractedText is undefined or not an array
        if (!Array.isArray(extractedText)) {
          throw new Error('Extracted text is not in the expected format.');
        }
  
        // Parse the extracted text
        const parsedData = parseExtractedText(extractedText);
  
        // Print the final results
        console.log('Parsed Data:', parsedData);
      }
  
      return { statusCode: 200, body: 'Processing complete' };
    } catch (error) {
      console.error('Error processing document:', error);
      return { statusCode: 500, body: 'Error processing document' };
    }
  };
  
  // Function to parse the extracted text
  function parseExtractedText(extractedText: string[]): any {
    const parsedData: any = {};
  
    // Iterate through each line of extracted text
    for (const line of extractedText) {
      // Example parsing logic for account number and invoice number
      if (line.includes('Account Number:')) {
        parsedData.accountNumber = line.replace('Account Number:', '').trim();
      } else if (line.includes('Invoice No.:')) {
        parsedData.invoiceNumber = line.replace('Invoice No.:', '').trim();
      }
  
      // Example parsing logic for numerical values (electricity bill, water bill, total outstanding)
      const billMatch = line.match(/(\d+\.\d+)\s*BD/);
      if (billMatch) {
        const billAmount = parseFloat(billMatch[1]);
        if (line.includes('Electricity')) {
          parsedData.electricityBill = billAmount;
        } else if (line.includes('Water')) {
          parsedData.waterBill = billAmount;
        } else if (line.includes('Total Outstanding')) {
          parsedData.totalOutstanding = billAmount;
        }
      }
    }
  
    return parsedData;
  }
  
  