import { CloudFormation } from 'aws-sdk';

const fetchStackOutputs = async (stackName: string): Promise<{ [key: string]: string }> => {
    const cloudFormation = new CloudFormation();
    try {
        const data = await cloudFormation.describeStacks({ StackName: stackName }).promise();
        const outputs = data.Stacks?.[0].Outputs;
        if (!outputs) {
            throw new Error('No outputs found for the stack');
        }
        return outputs.reduce((acc, current) => {
            if (current.OutputKey && current.OutputValue) {
                acc[current.OutputKey] = current.OutputValue;
            }
            return acc;
        }, {} as { [key: string]: string });
    } catch (error) {
        console.error(`Error fetching outputs for stack ${stackName}:`, error);
        throw error;
    }
};

export default fetchStackOutputs;
