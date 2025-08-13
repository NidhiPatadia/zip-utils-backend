import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { getUrl } from '../get-url';
import {
  MOCKED_URL_RECORD,
  mockedGetUrlArgs,
} from '../__fixtures__/common.mock';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('getUrl', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  it('Should get url on successful call of the api', async () => {
    ddbMock.on(GetCommand).resolves({ Item: MOCKED_URL_RECORD });
    const response = await getUrl(null, mockedGetUrlArgs);
    expect(response).toEqual(MOCKED_URL_RECORD.url);
  });

  it('Should not get url when GetCommand Operation on DB fails', async () => {
    ddbMock.on(GetCommand).rejects({});
    await expect(getUrl(null, mockedGetUrlArgs)).rejects.toThrow();
  });

  it('Should not get url when GetCommand Operation returns item without url', async () => {
    ddbMock.on(GetCommand).resolves({ Item: { id: MOCKED_URL_RECORD.id } });
    await expect(getUrl(null, mockedGetUrlArgs)).rejects.toThrow();
  });
});
