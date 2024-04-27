import * as AWS from 'aws-sdk';

let hasRun = false; // Flag variable to ensure the code runs only once

const textract = new AWS.Textract();
const comprehend = new AWS.Comprehend();
const sqs = new AWS.SQS();
const queue_URL = process.env.QUEUE_URL; // Access queue URL from environment

export const handler = async (event: any): Promise<any> => {

  try {

    if (hasRun) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Code has already run once' }) };
    }

    // Extract bucket name and file name from the SQS event

    const records = event.Records;
    for (const record of records) {
      const body = JSON.parse(record.body);
      const bucketName = body.Records[0].s3.bucket.name;
      const objectKey = body.Records[0].s3.object.key;

      // Run the file through AWS Textract
      const textractParams: AWS.Textract.AnalyzeDocumentRequest = {
        FeatureTypes: ['FORMS'],
        Document: {
          S3Object: {
            Bucket: bucketName,
            Name: objectKey
          }
        }
      };

      // Assuming textractResult contains the result from Textract

      const textractResult = await textract.analyzeDocument(textractParams).promise();


      // Extract information from the Textract result
      const blocks = textractResult.Blocks;
      if (blocks) {
        // Log the text extracted from the document
        // console.log('Extracted text from document:', blocks);
        const textBlocks = blocks.filter(block => block.BlockType === 'LINE');
        // console.log('Text blocks:', textBlocks);
        const extractedText = textBlocks.map(block => block.Text);
        // console.log('Extracted text:', extractedText);


        // Use AWS Comprehend to analyze the extracted text
        const comprehendParams: AWS.Comprehend.DetectEntitiesRequest = {
          LanguageCode: 'en', // Adjust language code as per your text
          Text: extractedText.join('\n')
        };

        const comprehendResult = await comprehend.detectEntities(comprehendParams).promise();
        // console.log('Comprehend result:', comprehendResult);



        // Check if comprehendResult is defined and contains Entities
        if (comprehendResult && comprehendResult.Entities) {
          const otherEntitiesText: string[] = comprehendResult.Entities
            .filter((entity: any) => entity.Type === 'OTHER')
            .slice(0, 4)
            .map((entity: any) => entity.Text.replace(/\d+\n/, ''))
            .filter((text: string | undefined) => text !== undefined) as string[];

          const combinedText: string = otherEntitiesText.join(' ');

          // Extract the text from the 17th quantity entity and format it
          const electricityEntityText: string | undefined = comprehendResult.Entities
            .filter((entity: any) => entity.Type === 'QUANTITY')
            .map((entity: any) => {
              const text: string = entity.Text;
              // Replace the newline character followed by numbers with an empty string
              return text.replace(/\n\d+/, '');
            })
            .filter((text: string) => text.trim() !== '')[18]; // Select the 19th element (index 18)



          // Send extracted text to SQS queue
          const sqsParams: AWS.SQS.SendMessageRequest = {
            // @ts-ignore
            QueueUrl: queue_URL,
            MessageBody: JSON.stringify({ textractResult, combinedText, electricityEntityText }) // Send extracted text as JSON object
          };

          await sqs.sendMessage(sqsParams).promise();
          // console.log('Extracted text sent to SQS queue');
          // console.log('Combined text:', combinedText);

        } else {
          console.log("No entities found.");
        }



      }
    }

    return { statusCode: 200, body: 'Processing complete' };
  } catch (error) {
    console.error('Error processing document:', error);
    return { statusCode: 500, body: 'Error processing document' };
  }
};
