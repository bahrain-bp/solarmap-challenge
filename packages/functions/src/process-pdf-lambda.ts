import * as AWS from 'aws-sdk';

const textract = new AWS.Textract();
const comprehend = new AWS.Comprehend();
const sqs = new AWS.SQS();
const queue_URL = process.env.QUEUE_URL; // Access queue URL from environment

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

      // Extract information from the Textract result
      const blocks = textractResult.Blocks;
      if (blocks) {
        // Log the text extracted from the document
        const textBlocks = blocks.filter(block => block.BlockType === 'LINE');
        const extractedText = textBlocks.map(block => block.Text);
        //console.log('Extracted text:', extractedText);


        // Use AWS Comprehend to analyze the extracted text
        const comprehendParams: AWS.Comprehend.DetectEntitiesRequest = {
          LanguageCode: 'en', // Adjust language code as per your text
          Text: extractedText.join('\n')
        };

        const comprehendResult = await comprehend.detectEntities(comprehendParams).promise();
        // console.log('Comprehend result:', comprehendResult);

        // Send extracted text to SQS queue
        const sqsParams: AWS.SQS.SendMessageRequest = {
          // @ts-ignore
          QueueUrl: queue_URL,
          MessageBody: JSON.stringify({ extractedText }) // Send extracted text as JSON object
        };

        await sqs.sendMessage(sqsParams).promise();
        // console.log('Extracted text sent to SQS queue');

      }
    }

    return { statusCode: 200, body: 'Processing complete' };
  } catch (error) {
    console.error('Error processing document:', error);
    return { statusCode: 500, body: 'Error processing document' };
  }
};
