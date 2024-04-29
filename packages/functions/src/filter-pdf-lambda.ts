import { SQL } from "./sql";
import moment from 'moment';


interface Block {
  Id: string;
  BlockType: string;
  Relationships?: { Type: string, Ids: string[] }[];
  EntityTypes?: string[];
  SelectionStatus?: string;
  Text?: string;
}

function items(obj: Record<string, any>): any[] {
  return Object.values(obj);
}

function findValueBlock(keyBlock: Block, valueMap: Record<string, Block>): Block | undefined {
  let valueBlock: Block | undefined;
  for (const relationship of keyBlock.Relationships || []) {
    if (relationship.Type === "VALUE") {
      for (const valueId of relationship.Ids) {
        valueBlock = valueMap[valueId];
      }
    }
  }
  return valueBlock;
}

function getText(result: Block, blockMap: Record<string, Block>): string {
  let text = "";
  if (result.Relationships) {
    for (const relationship of result.Relationships || []) {
      if (relationship.Type === "CHILD") {
        for (const childId of relationship.Ids) {
          const word = blockMap[childId];
          if (word.BlockType === "WORD") {
            text += word.Text + " ";
          }
          if (word.BlockType === "SELECTION_ELEMENT") {
            if (word.SelectionStatus === "SELECTED") {
              text += "X ";
            }
          }
        }
      }
    }
  }
  return text;
}

function getRelationships(keyMap: Record<string, Block>, valueMap: Record<string, Block>, blockMap: Record<string, Block>): Record<string, string> {
  const kvs: Record<string, string> = {};
  const itemsKeyMap = items(keyMap);
  for (const key_block of itemsKeyMap) {
    const value_block = findValueBlock(key_block, valueMap);
    const key = getText(key_block, blockMap);
    const val = value_block ? getText(value_block, blockMap) : '';
    kvs[key] = val;
  }
  return kvs;
}

export const handler = async (event: any): Promise<any> => {
  try {

    const sqsMessageBody = JSON.parse(event.Records[0].body);
    const textractResult = sqsMessageBody.textractResult;
    const combinedText = sqsMessageBody.combinedText;
    const electricitySupply = sqsMessageBody.electricityEntityText;


    const key_map: Record<string, Block> = {};
    const value_map: Record<string, Block> = {};
    const block_map: Record<string, Block> = {};

    textractResult.Blocks.forEach((block: Block) => {
      let block_id = block.Id;
      block_map[block_id] = block;
      if (block.BlockType === "KEY_VALUE_SET") {
        if (block.EntityTypes && block.EntityTypes[0] === "KEY") {
          key_map[block_id] = block;
        } else {
          value_map[block_id] = block;
        }
      }
    });

    const kvs = getRelationships(key_map, value_map, block_map);
    
    console.log("Data:", kvs);
    /*
    ["key":"value",...,"key":"value"]
    */


    console.log("Address:", combinedText);
    console.log('Maximum Electricity Power Supply:', electricitySupply);
    
    const formattedElectricitySupply = parseInt(electricitySupply.replace(/\skWh/, ''));
    



    const issueDateStr = kvs['Issue Date: ']; // Extract the value associated with the key 'Issue Date:'
    // console.log('Issue Date:', issueDateStr)
    const issueDate = moment(issueDateStr, 'DD/MM/YYYY');
    // Format the date as YYYY-MM-DD
    const formattedIssueDate = issueDate.format('YYYY-MM-DD');
    console.log('Issue Date:', formattedIssueDate);




    const BD = parseFloat(kvs['BD ']);
    const rate = parseFloat(kvs['Rate ']);
    const monthlyBill = BD * ((rate * 10) + 1); // Float
    // console.log('BD:', BD);
    console.log('Rate:', rate, 'BD');
    console.log('Monthly Bill:', monthlyBill, 'BD');


    const usage = kvs['Actual '];
    // Split the value string by space
    const parts = usage.split(' ');
    // Get the last element of the array
    const secondReading = parseInt(parts[1]); // Integer
    console.log('Usage:', secondReading, 'kWh');


    let isSubsidized = false; // Boolean
    if (kvs.hasOwnProperty('Non Domestic ')) {
      isSubsidized = true;
    } else {
      isSubsidized = false;
    }
    console.log('Subsidized:', isSubsidized);

    // Check if all required fields are provided
    if (!combinedText || !formattedIssueDate || !monthlyBill || !secondReading || !rate || !isSubsidized || !formattedElectricitySupply) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields in the request body' }),
      };
    }

    // Insert the new vehicle into the database
    await SQL.DB
      .insertInto("ewabill")
      .values({
        issue_date: formattedIssueDate,
        monthly_bill: monthlyBill,
        electricity_supply: formattedElectricitySupply,
        rate: rate,
        usage: secondReading,
        bill_address: combinedText,
        subsidised: isSubsidized,
      })
      .execute();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Document inserted successfully' + 'Processing complete' + JSON.stringify({ kvs }) }), // Include kvs in the response body
    };


  } catch (error) {
    console.error('Error processing document:', error);
    return { statusCode: 500, body: 'Error processing document' };
  }
};