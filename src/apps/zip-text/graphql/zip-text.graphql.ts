export const typeDefs = `
type Query {
  getZipText(url: String!): String!
}

type Mutation {
  generateZipTextUrl(text: String!): String!
}
`;
