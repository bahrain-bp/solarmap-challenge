export const handler = async (event: any): Promise<any> => {
    try {
        console.log("Received event:", event);

        // Assuming event structure is as shown in your log
        const records = event.Records;

        // Check if there are records and process the first one
        if (records && records.length > 0) {
            const firstRecord = records[0];

            // Extracting bucket name
            const bucketName = firstRecord.body ? JSON.parse(firstRecord.body).Records[0].s3.bucket.name : null;

            // Extracting object key
            const objectKey = firstRecord.body ? JSON.parse(firstRecord.body).Records[0].s3.object.key : null;

            console.log(`Bucket Name: ${bucketName}`);
            console.log(`Object Key: ${objectKey}`);

            // You can add further logic here to handle the bucket name and object key
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Process successful",
                input: event,
            }),
        };
    } catch (error) {
        console.error("Error processing event:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error processing your request",
            }),
        };
    }
}
