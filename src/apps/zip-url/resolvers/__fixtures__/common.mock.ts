import { IUrlRecord } from '../../../../dynamo/dynamo.class';

export const MOCKED_URL_RECORD: IUrlRecord = {
  id: 'vpdfqbO',
  url: 'google.com',
};
export const mockedGenerateUrlArgs = { url: MOCKED_URL_RECORD.url };
export const mockedGetUrlArgs = {
  url: `https://localhost:4200/${MOCKED_URL_RECORD.id}`,
};
