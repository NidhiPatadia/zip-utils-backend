import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { config, ENVIRONMENTS } from '../configs/common.config';

export interface IUrlRecord {
  id: string;
  url: string;
}

export class DynamoDbOperations {
  private readonly client: DynamoDBClient;
  private readonly docClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor() {
    const NODE_ENV = process.env.NODE_ENV;

    // creating a dynamo client based on env
    this.client = new DynamoDBClient(
      !NODE_ENV ||
      NODE_ENV === ENVIRONMENTS.LOCAL ||
      NODE_ENV === ENVIRONMENTS.TEST
        ? {
            endpoint: config.LOCAL_DYNAMODB_ENDPOINT,
          }
        : {
            region: config.region,
          },
    );
    this.docClient = DynamoDBDocumentClient.from(this.client);
    this.tableName = process.env.URLS_TABLE_NAME as string;
  }

  async putItemInUrlsTable(id: string, url: string) {
    const mn = this.putItemInUrlsTable.name;
    try {
      const putItemParams = new PutCommand({
        TableName: this.tableName,
        Item: {
          id,
          url,
        },
      });
      console.log(`${mn}:`, putItemParams.input);
      await this.docClient.send(putItemParams);
    } catch (e: any) {
      console.error(`ERROR ${mn}`, e);
      throw new Error(e);
    }
  }

  async getItemFromUrlsTable(id: string): Promise<IUrlRecord> {
    const mn = this.getItemFromUrlsTable.name;
    try {
      const getItemParams = new GetCommand({
        TableName: this.tableName,
        Key: {
          id,
        },
      });
      console.log(`${mn}:`, getItemParams.input);

      const response = await this.docClient.send(getItemParams);
      console.log(`${mn}:`, response.Item);
      return response.Item as IUrlRecord;
    } catch (e: any) {
      console.error(`ERROR ${mn}`, e);
      throw new Error(e);
    }
  }
}
