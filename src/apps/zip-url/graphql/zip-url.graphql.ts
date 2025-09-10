export const typeDefs = `
type Query {
  healthCheck: Boolean!
  getUrl(url: String!): String!
}

type Mutation {
  generateUrl(url: String!, expiryInMinutes: Int): String!
}
`;
