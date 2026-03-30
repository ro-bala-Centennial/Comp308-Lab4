const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: String
  }

  type AuthPayload {
    message: String!
    token: String
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    signup(
      username: String!
      email: String!
      password: String!
      role: String!
    ): AuthPayload!

    login(
      email: String!
      password: String!
    ): AuthPayload!

    logout: AuthPayload!
  }
`;

module.exports = typeDefs;