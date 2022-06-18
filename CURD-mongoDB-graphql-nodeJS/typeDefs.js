const { gql } = require("apollo-server-express");
// The GraphQL schema
const typeDefs = gql`
  type Post {
    id: ID
    title: String
    description: String
  }

  type Query {
    "A simple type for getting started!"
    hello: String

    getAllPosts: [Post]
    getPost(id: ID): Post
  }

  input PostInput {
    title: String
    description: String
  }
  type Mutation {
    createPost(post: PostInput): Post
    deletePost(id: ID): String
    updatePost(id: ID, post: PostInput): Post
  }
`;

module.exports = typeDefs;
