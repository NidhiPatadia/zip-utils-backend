import { generateZipTextUrl, getZipText } from '../resolvers';
import { typeDefs } from './zip-text.graphql';

const resolvers = {
  Query: {
    getZipText,
  },
  Mutation: {
    generateZipTextUrl,
  },
};

export { typeDefs, resolvers };
