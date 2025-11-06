import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { config, ENVIRONMENTS } from '../configs/common.config';
import { EncryptionHelper } from '../services/EncryptionHelper';

export interface IUrlRecord {
  id: string;
  url: string;
  expiryTime?: number;
}

export interface IZipTextRecord {
  id: string;
  text: string;
  expiryTime?: number;
}

export class DynamoDbOperations {
  private readonly client: DynamoDBClient;
  private readonly docClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(tableName: string) {
    const NODE_ENV = process.env.NODE_ENV;

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
    this.tableName = tableName;
  }

  async putItemInUrlsTable(id: string, url: string, expiryTime?: number) {
    const mn = this.putItemInUrlsTable.name;
    try {
      const encryptedUrl = await EncryptionHelper.encrypt(url);
      const item: any = {
        id,
        encryptedUrl,
      };
      if (expiryTime !== undefined) {
        item.expiryTime = expiryTime;
      }
      const putItemParams = new PutCommand({
        TableName: this.tableName,
        Item: item,
      });

      console.log(`${mn}:`, putItemParams.input);
      await this.docClient.send(putItemParams);
    } catch (e: any) {
      console.error(`ERROR ${mn}`, e);
      throw new Error(e);
    }
  }

  async getItemFromUrlsTable(id: string): Promise<IUrlRecord | null> {
    const mn = this.getItemFromUrlsTable.name;
    try {
      const getItemParams = new GetCommand({
        TableName: this.tableName,
        Key: { id },
      });
      console.log(`${mn}:`, getItemParams.input);
      const response = await this.docClient.send(getItemParams);
      const record = response.Item as IUrlRecord | undefined;

      if (!record) {
        console.log(`${mn}: No record found`);
        return null;
      }
      const now = Math.floor(Date.now() / 1000);
      const isExpired =
        record.expiryTime !== undefined && record.expiryTime <= now;
      if (isExpired) {
        console.log(`${mn}: Record found but expired`);
        return null;
      }

      // ✅ Decrypt before returning
      const decryptedUrl = await EncryptionHelper.decrypt(record.encryptedUrl);
      const decryptedRecord = { ...record, url: decryptedUrl };
      console.log(`${mn}:`, decryptedRecord);
      return decryptedRecord;
    } catch (e: any) {
      console.error(`ERROR ${mn}`, e);
      throw new Error(e);
    }
  }

  async putItemInZipTextTable(id: string, text: string, expiryTime: number) {
    const mn = this.putItemInZipTextTable.name;
    try {
      const encryptedText = await EncryptionHelper.encrypt(text);
      const putItemParams = new PutCommand({
        TableName: this.tableName,
        Item: { id, encryptedText, expiryTime },
      });
      console.log(`${mn}:`, putItemParams.input);
      await this.docClient.send(putItemParams);
    } catch (e: any) {
      console.error(`ERROR ${mn}`, e);
      throw new Error(e);
    }
  }

  async getItemFromZipTextTable(id: string): Promise<IZipTextRecord | null> {
    const mn = this.getItemFromZipTextTable.name;
    try {
      const getItemParams = new GetCommand({
        TableName: this.tableName,
        Key: { id },
      });

      console.log(`${mn}:`, getItemParams.input);
      const response = await this.docClient.send(getItemParams);

      const record = response.Item as IZipTextRecord | undefined;

      if (!record) {
        console.log(`${mn}: No record found`);
        return null;
      }

      const now = Math.floor(Date.now() / 1000);
      const isExpired =
        record.expiryTime !== undefined && record.expiryTime <= now;

      if (isExpired) {
        console.log(`${mn}: Record found but expired`);
        return null;
      }
      console.log('Encrypted Record:', record);
      // ✅ Decrypt before returning
      const decryptedText = await EncryptionHelper.decrypt(record.encryptedText);
      const decryptedRecord = { ...record, text: decryptedText };

      console.log(`${mn}:`, decryptedRecord);
      return decryptedRecord;
    } catch (e: any) {
      console.error(`ERROR ${mn}`, e);
      throw new Error(e);
    }
  }
}
