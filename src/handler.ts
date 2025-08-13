import { ApolloServer } from '@apollo/server';
import {
  handlers,
  startServerAndCreateLambdaHandler,
} from '@as-integrations/aws-lambda';
import { resolvers, typeDefs } from './apps/zip-url/graphql';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
);
