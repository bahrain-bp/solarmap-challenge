import * as AWS from 'aws-sdk';

const textract = new AWS.Textract();

export const handler = async (event: any): Promise<any> => {
  try {
    // Extract bucket name and file name from the SQS event
    const records = event.Records;
    for (const record of records) {
      const body = JSON.parse(record.body);
      const bucketName = body.Records[0].s3.bucket.name;
      const objectKey = body.Records[0].s3.object.key;

      // Run the file through AWS Textract
      const textractParams: AWS.Textract.AnalyzeDocumentRequest = {
        FeatureTypes: ['TABLES', 'FORMS'],
        Document: {
          S3Object: {
            Bucket: bucketName,
            Name: objectKey
          }
        }
      };

      const textractResult = await textract.analyzeDocument(textractParams).promise();
      console.log('Textract result:', textractResult);

      // Extract information from the Textract result
      const blocks = textractResult.Blocks;
      if (blocks) {
        // Log the text extracted from the document
        const textBlocks = blocks.filter(block => block.BlockType === 'LINE');
        const extractedText = textBlocks.map(block => block.Text);
        console.log('Extracted text:', extractedText);

        // Log the tables extracted from the document
        const tableBlocks = blocks.filter(block => block.BlockType === 'TABLE');
        console.log('Number of tables:', tableBlocks.length);

        // Log the forms extracted from the document
        const formBlocks = blocks.filter(block => block.BlockType === 'KEY_VALUE_SET');
        console.log('Number of forms:', formBlocks.length);
      }
    }

    return { statusCode: 200, body: 'Processing complete' };
  } catch (error) {
    console.error('Error processing document:', error);
    return { statusCode: 500, body: 'Error processing document' };
  }
};
