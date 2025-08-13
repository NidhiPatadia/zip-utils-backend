import ShortUniqueId from 'short-unique-id';
import { config } from '../configs/common.config';
import { DynamoDbOperations } from '../dynamo/dynamo.class';

export class URLService {
  async generateUrl(url: string) {
    console.log('Requested URL:', url);

    // generating shortUrl using short uuid package
    const uuid = new ShortUniqueId();
    const id = uuid.randomUUID(config.minUrlLength);

    // creating a record in dynamodb
    await new DynamoDbOperations().putItemInUrlsTable(id, url);

    // returning the shortned url to the end user
    const shortUrl = `${process.env.FRONTEND_DOMAIN}/${id}`;
    console.log('Short URL:', shortUrl);
    return shortUrl;
  }

  async getUrl(shortUrl: string) {
    console.log('Requested Short URL:', shortUrl);

    // fetching 'id' from short url
    const urlParts = shortUrl.split('/');
    const id = urlParts[urlParts.length - 1];

    // get url based on 'id'
    const urlRecord = await new DynamoDbOperations().getItemFromUrlsTable(id);

    // throw error for UI, if url not found
    if (!urlRecord?.url) {
      throw new Error('URL not found!');
    }

    return urlRecord.url;
  }
}
