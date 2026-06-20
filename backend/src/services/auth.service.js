import bcrypt from "bcrypt";
import * as userRepository from "../repositories/user.repository.js";
import AppError from "../utils/AppError.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

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

  const accessToken = generateAccessToken({
    userId: user._id,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id,
  });

  await userRepository.updateRefreshToken(user._id, refreshToken);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

export const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = generateAccessToken({
    userId: user._id,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id,
  });

  await userRepository.updateRefreshToken(user._id, refreshToken);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken,
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
