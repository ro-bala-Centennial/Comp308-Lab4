const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      return await User.findById(context.user.id);
    },
  },

  Mutation: {
    signup: async (_, { username, email, password, role }) => {
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        throw new Error("Username or email already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
      });

      const token = createToken(user);

      return {
        message: "Signup successful",
        token,
        user,
      };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      const token = createToken(user);

      return {
        message: "Login successful",
        token,
        user,
      };
    },

    logout: async () => {
      return {
        message: "Logout successful. Remove token on client side.",
        token: null,
        user: null,
      };
    },
  },
};

module.exports = resolvers;