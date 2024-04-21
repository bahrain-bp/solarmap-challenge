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
    console.log("kvs", kvs);
    /*
    ["key":"value",...,"key":"value"]
    */
    
    return { statusCode: 200, body: 'Processing complete' + JSON.stringify({ kvs }) }// Include kvs in the response body };
  } catch (error) {
    console.error('Error processing document:', error);
    return { statusCode: 500, body: 'Error processing document' };
  }
};