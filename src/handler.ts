import { ApolloServer } from '@apollo/server';
import {
  handlers,
  startServerAndCreateLambdaHandler,
} from '@as-integrations/aws-lambda';
import { resolvers, typeDefs } from './apps/zip-url/graphql';
import { ENVIRONMENTS } from './configs/common.config';

const NODE_ENV = process.env.NODE_ENV;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: NODE_ENV !== ENVIRONMENTS.PROD,
});

export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
);
