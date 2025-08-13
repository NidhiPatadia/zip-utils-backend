export enum ENVIRONMENTS {
  LOCAL = 'local',
  DEV = 'dev',
  PROD = 'prod',
  TEST = 'test',
}

export const config = {
  minUrlLength: 7,
  region: 'ap-south-1',
  LOCAL_DYNAMODB_ENDPOINT: 'http://localhost:8000',
};
