import { ApolloServer } from '@apollo/server';
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from '@as-integrations/aws-lambda';
import { resolvers, typeDefs } from './apps/zip-url/graphql';
import { ENVIRONMENTS } from './configs/common.config';

const NODE_ENV = process.env.NODE_ENV;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: NODE_ENV !== ENVIRONMENTS.PROD,
});

const handler = handlers.createAPIGatewayProxyEventRequestHandler();

export const graphqlHandler = async (event, context) => {
  const response = await startServerAndCreateLambdaHandler(server, handler)(event, context);

  response.headers = {
    ...response.headers,
    'Access-Control-Allow-Origin': 'https://ziputils.com',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'OPTIONS, POST',
  };

  return response;
};
