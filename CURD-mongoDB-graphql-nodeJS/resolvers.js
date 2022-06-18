const Post = require("./models/Post.model");

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: () => {
      return "Hello world";
    },
    getAllPosts: async () => {
      return await Post.find();
    },
    getPost: async (_, { id }, context, info) => {
      return await Post.findById(id);
    },
  },

  Mutation: {
    createPost: (parent, args, context, info) => {
      const { title, description } = args.post;
      const post = new Post({ title, description });
      return post;
    },
    deletePost: async (parent, { id }, context, info) => {
      await Post.findByIdAndDelete(id);
      return "OK, post Deleted";
    },
    updatePost: async (parent, args, context, info) => {
      const { id } = args;
      const { title, description } = args.post;
      const post = await Post.findByIdAndUpdate(
        id,
        { title, description },
        { new: true }
      );
      return post;
    },
  },
};

module.exports = resolvers;
