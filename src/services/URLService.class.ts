import ShortUniqueId from 'short-unique-id';
import { config } from '../configs/common.config';
import { DynamoDbOperations } from '../dynamo/dynamo.class';

export class URLService {
  private urlsTableName = process.env.URLS_TABLE_NAME as string;
  private zipTextTableName = process.env.ZIPTEXT_TABLE_NAME as string;

  async generateUrl(url: string, expiryInMinutes?: number): Promise<string> {
    console.log('Requested URL:', url);

    // generating shortUrl using short uuid package
    const uuid = new ShortUniqueId();
    const id = uuid.randomUUID(config.minUrlLength);

    // ⏱️ Optional expiry time
    let expiryTime: number | undefined = undefined;

    if (expiryInMinutes !== undefined && expiryInMinutes > 0) {
      const nowInSeconds = Math.floor(Date.now() / 1000);
      expiryTime = nowInSeconds + expiryInMinutes * 60;
    }

    // creating a record in dynamodb
    await new DynamoDbOperations(this.urlsTableName).putItemInUrlsTable(
      id,
      url,
      expiryTime,
    );

    // returning the shortned url to the end user
    return id;
  }

  async getUrl(shortUrl: string) {
    console.log('Requested Short URL:', shortUrl);

    // fetching 'id' from short url
    const urlParts = shortUrl.split('/');
    const id = urlParts[urlParts.length - 1];

    // get url based on 'id'
    const urlRecord = await new DynamoDbOperations(
      this.urlsTableName,
    ).getItemFromUrlsTable(id);

    // throw error for UI, if url not found
    if (!urlRecord?.url) {
      throw new Error('URL not found!');
    }

    return urlRecord.url;
  }

  // 📝 For storing long custom text
  async generateZipTextUrl(
    text: string,
    expiryInMinutes = 1440,
  ): Promise<string> {
    console.log('Requested Text:', text);

    const uuid = new ShortUniqueId();
    const id = uuid.randomUUID(config.minUrlLength);

    // Calculate TTL timestamp
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const ttl = nowInSeconds + expiryInMinutes * 60;

    await new DynamoDbOperations(this.zipTextTableName).putItemInZipTextTable(
      id,
      text,
      ttl,
    );
    return id;
  }

  async getZipTextById(id: string): Promise<string> {
    console.log('Fetching text with ID:', id);

    const record = await new DynamoDbOperations(
      this.zipTextTableName,
    ).getItemFromZipTextTable(id);

    const now = Math.floor(Date.now() / 1000);

    if (!record?.text) {
      throw new Error('Text not found!');
    }

    return record.text;
  }
}
