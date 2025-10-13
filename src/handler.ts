import { ApolloServer } from '@apollo/server';
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from '@as-integrations/aws-lambda';

import {
  resolvers as zipUrlResolvers,
  typeDefs as zipUrlTypeDefs,
} from './apps/zip-url/graphql';
import {
  resolvers as zipTextResolvers,
  typeDefs as zipTextTypeDefs,
} from './apps/zip-text/graphql';

import { ENVIRONMENTS } from './configs/common.config';

// 🧬 Combine typeDefs
const typeDefs = `
  ${zipUrlTypeDefs}
  ${zipTextTypeDefs}
`;

// 🧬 Combine resolvers
const resolvers = {
  Query: {
    ...zipUrlResolvers.Query,
    ...zipTextResolvers.Query,
  },
  Mutation: {
    ...zipUrlResolvers.Mutation,
    ...zipTextResolvers.Mutation,
  },
};

const NODE_ENV = process.env.NODE_ENV;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: NODE_ENV !== ENVIRONMENTS.PROD,
});

const handler = handlers.createAPIGatewayProxyEventRequestHandler();

export const graphqlHandler = async (event, context) => {
  const response = await startServerAndCreateLambdaHandler(server, handler)(
    event,
    context,
  );

  response.headers = {
    ...response.headers,
    'Access-Control-Allow-Origin': process.env.FRONTEND_DOMAIN,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'OPTIONS, POST',
  };

  return response;
};
