import bcrypt from "bcrypt";
import * as userRepository from "../repositories/user.repository.js";
import AppError from "../utils/AppError.js";
import { generateToken } from "../utils/jwt.js";

export const register = async ({ name, email, password }) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await userRepository.createUser({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken({
    userId: user._id,
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

export const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError("Invalid credentials U", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid Credentials P", 401);
  }

  const token = generateToken({ userId: user._id });
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

export const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};
