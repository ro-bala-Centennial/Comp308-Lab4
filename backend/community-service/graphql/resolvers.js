const CommunityPost = require("../models/CommunityPost");
const HelpRequest = require("../models/HelpRequest");

const requireAuth = (context) => {
  if (!context.user) {
    throw new Error("Not authenticated");
  }
};

const resolvers = {
  Query: {
    getPosts: async () => {
      return await CommunityPost.find().sort({ createdAt: -1 });
    },

    getPostsByCategory: async (_, { category }) => {
      return await CommunityPost.find({ category }).sort({ createdAt: -1 });
    },

    getHelpRequests: async () => {
      return await HelpRequest.find().sort({ createdAt: -1 });
    },

    getMyHelpRequests: async (_, __, context) => {
      requireAuth(context);
      return await HelpRequest.find({ author: context.user.id }).sort({ createdAt: -1 });
    },
  },

  Mutation: {
    createPost: async (_, args, context) => {
      requireAuth(context);

      const post = await CommunityPost.create({
        author: context.user.id,
        title: args.title,
        content: args.content,
        category: args.category,
        aiSummary: args.aiSummary || "",
      });

      return post;
    },

    updatePost: async (_, { id, ...updates }, context) => {
      requireAuth(context);

      const post = await CommunityPost.findById(id);
      if (!post) throw new Error("Post not found");
      if (post.author.toString() !== context.user.id) {
        throw new Error("Not authorized");
      }

      Object.keys(updates).forEach((key) => {
        if (updates[key] !== undefined) {
          post[key] = updates[key];
        }
      });

      await post.save();
      return post;
    },

    deletePost: async (_, { id }, context) => {
      requireAuth(context);

      const post = await CommunityPost.findById(id);
      if (!post) throw new Error("Post not found");
      if (post.author.toString() !== context.user.id) {
        throw new Error("Not authorized");
      }

      await CommunityPost.findByIdAndDelete(id);
      return "Post deleted successfully";
    },

    createHelpRequest: async (_, { description, location }, context) => {
      requireAuth(context);

      return await HelpRequest.create({
        author: context.user.id,
        description,
        location: location || "",
      });
    },

    volunteerForHelpRequest: async (_, { id }, context) => {
      requireAuth(context);

      const request = await HelpRequest.findById(id);
      if (!request) throw new Error("Help request not found");

      const alreadyVolunteered = request.volunteers.some(
        (v) => v.toString() === context.user.id
      );

      if (!alreadyVolunteered) {
        request.volunteers.push(context.user.id);
        await request.save();
      }

      return request;
    },

    resolveHelpRequest: async (_, { id }, context) => {
      requireAuth(context);

      const request = await HelpRequest.findById(id);
      if (!request) throw new Error("Help request not found");

      if (request.author.toString() !== context.user.id) {
        throw new Error("Only the author can resolve this help request");
      }

      request.isResolved = true;
      await request.save();

      return request;
    },
  },
};

module.exports = resolvers;