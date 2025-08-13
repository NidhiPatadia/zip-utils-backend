import { generateUrl, getUrl, healthCheck } from '../resolvers';
import { typeDefs } from './zip-url.graphql';

const resolvers = {
  Query: {
    healthCheck,
    getUrl,
  },
  Mutation: {
    generateUrl,
  },
};

export { typeDefs, resolvers };
