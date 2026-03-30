const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type CommunityPost {
    id: ID!
    author: ID!
    title: String!
    content: String!
    category: String!
    aiSummary: String
    createdAt: String
    updatedAt: String
  }

  type HelpRequest {
    id: ID!
    author: ID!
    description: String!
    location: String
    isResolved: Boolean
    volunteers: [ID]
    createdAt: String
    updatedAt: String
  }

  type Query {
    getPosts: [CommunityPost!]!
    getPostsByCategory(category: String!): [CommunityPost!]!
    getHelpRequests: [HelpRequest!]!
    getMyHelpRequests: [HelpRequest!]!
  }

  type Mutation {
    createPost(
      title: String!
      content: String!
      category: String!
      aiSummary: String
    ): CommunityPost!

    updatePost(
      id: ID!
      title: String
      content: String
      category: String
      aiSummary: String
    ): CommunityPost!

    deletePost(id: ID!): String!

    createHelpRequest(
      description: String!
      location: String
    ): HelpRequest!

    volunteerForHelpRequest(id: ID!): HelpRequest!

    resolveHelpRequest(id: ID!): HelpRequest!
  }
`;

module.exports = typeDefs;