// Lambda function
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as aws from 'aws-sdk';

export const sendEmail = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let { userEmail = '', body = '', subject = '' } = {}; 

  try {
    console.log(`Email: ${userEmail}, Subject: ${subject}, Message: ${body}`);

    const requestBody = JSON.parse(event.body || '{}');
    userEmail = requestBody.userEmail;
    body = requestBody.body;
    subject = requestBody.subject;

    // Check if userEmail is empty
    if (!userEmail || !body || !subject) {
      throw new Error('User email, subject, and body are required.');
    }
  } catch (error) {
    console.error('Invalid JSON payload:', event.body);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON payload' }),
    };
  }

  const source = "suhaibrajabo@gmail.com";
  console.log('Source email:', source);
  console.log('User email:', userEmail);
  
  let data = {
    result: 'ERROR',
  };

  try {
    const ses = new aws.SES();

    await ses.sendEmail({
      Destination: {
        ToAddresses: [userEmail],
      },
      Source: source,
      Message: {
        Subject: {
          Data: subject || '',
        },
        Body: {
          Html: {
            Data: body || '',
          },
        },
      },
    }).promise();

    console.log('Email sent successfully');
    data.result = 'OK';
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error (test)' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
