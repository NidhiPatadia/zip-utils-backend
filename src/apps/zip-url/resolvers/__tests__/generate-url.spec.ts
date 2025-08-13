import { generateUrl } from '../generate-url';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { mockedGenerateUrlArgs } from '../__fixtures__/common.mock';

// const clientMock = mockClient(DynamoDBClient);
const ddbMock = mockClient(DynamoDBDocumentClient);

describe('generateUrl', () => {
  beforeEach(() => {
    // clientMock.reset();
    ddbMock.reset();
  });

  it('Should generate url on successful call of the api', async () => {
    // clientMock.on(CreateTableCommand).resolves({});
    ddbMock.on(PutCommand).resolves({});

    const response = await generateUrl(null, mockedGenerateUrlArgs);
    expect(response).toBeTruthy();
  });

  it('Should fail when put item in url fails', async () => {
    ddbMock.on(PutCommand).rejects({});
    await expect(generateUrl(null, mockedGenerateUrlArgs)).rejects.toThrow();
  });
});
