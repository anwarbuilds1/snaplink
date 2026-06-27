import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock("../../../src/repositories/user.repository.js", () => ({
  findByEmail: vi.fn(),
  createUser: vi.fn(),
  findById: vi.fn(),
  updateRefreshToken: vi.fn(),
}));

vi.mock("../../../src/utils/jwt.js", () => ({
  generateAccessToken: vi.fn(() => "access-token"),
  generateRefreshToken: vi.fn(() => "refresh-token"),
}));

import * as userRepository from "../../../src/repositories/user.repository.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../src/utils/jwt.js";

import {
  register,
  login,
  getProfile,
} from "../../../src/services/auth.service.js";
import { hashToken } from "../../../src/utils/hashToken.js";

describe("register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw error if user already exists", async () => {
    userRepository.findByEmail.mockResolvedValue({
      _id: "123",
      email: "anwar@example.com",
    });

    await expect(
      register({
        name: "Anwar",
        email: "anwar@example.com",
        password: "password123",
      }),
    ).rejects.toThrow("User already exists");

    expect(userRepository.createUser).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();

    expect(generateAccessToken).not.toHaveBeenCalled();
    expect(generateRefreshToken).not.toHaveBeenCalled();
  });

  it("should register user successfully", async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    bcrypt.hash.mockResolvedValue("hashedPassword");

    userRepository.createUser.mockResolvedValue({
      _id: "123",
      name: "Anwar",
      email: "anwar@example.com",
    });

    const result = await register({
      name: "Anwar",
      email: "anwar@example.com",
      password: "password123",
    });

    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 12);

    expect(userRepository.createUser).toHaveBeenCalledWith({
      name: "Anwar",
      email: "anwar@example.com",
      password: "hashedPassword",
    });

    expect(generateAccessToken).toHaveBeenCalledWith({
      userId: "123",
    });

    expect(generateRefreshToken).toHaveBeenCalledWith({
      userId: "123",
    });

    expect(userRepository.updateRefreshToken).toHaveBeenCalledWith(
      "123",
      hashToken("refresh-token"),
    );

    expect(result).toEqual({
      user: {
        id: "123",
        name: "Anwar",
        email: "anwar@example.com",
      },
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
  });
});

describe("login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw error if user does not exist", async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      login({
        email: "anwar@example.com",
        password: "password123",
      }),
    ).rejects.toThrow("Invalid credentials");

    expect(bcrypt.compare).not.toHaveBeenCalled();

    expect(generateAccessToken).not.toHaveBeenCalled();
    expect(generateRefreshToken).not.toHaveBeenCalled();
  });

  it("should throw error if password is invalid", async () => {
    userRepository.findByEmail.mockResolvedValue({
      _id: "123",
      email: "anwar@example.com",
      password: "hashedPassword",
    });

    bcrypt.compare.mockResolvedValue(false);

    await expect(
      login({
        email: "anwar@example.com",
        password: "wrongPassword",
      }),
    ).rejects.toThrow("Invalid credentials");

    expect(generateAccessToken).not.toHaveBeenCalled();
    expect(generateRefreshToken).not.toHaveBeenCalled();
  });

  it("should login successfully", async () => {
    userRepository.findByEmail.mockResolvedValue({
      _id: "123",
      name: "Anwar",
      email: "anwar@example.com",
      password: "hashedPassword",
    });

    bcrypt.compare.mockResolvedValue(true);

    const result = await login({
      email: "anwar@example.com",
      password: "password123",
    });

    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password123",
      "hashedPassword",
    );

    expect(generateAccessToken).toHaveBeenCalledWith({
      userId: "123",
    });

    expect(generateRefreshToken).toHaveBeenCalledWith({
      userId: "123",
    });

    expect(userRepository.updateRefreshToken).toHaveBeenCalledWith(
      "123",
      hashToken("refresh-token"),
    );

    expect(result).toEqual({
      user: {
        id: "123",
        name: "Anwar",
        email: "anwar@example.com",
      },
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
  });
});

describe("getProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw error if user does not exist", async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(getProfile("123")).rejects.toThrow("User not found");

    expect(userRepository.findById).toHaveBeenCalledWith("123");
  });

  it("should return profile successfully", async () => {
    userRepository.findById.mockResolvedValue({
      _id: "123",
      name: "Anwar",
      email: "anwar@example.com",
    });

    const result = await getProfile("123");

    expect(result).toEqual({
      id: "123",
      name: "Anwar",
      email: "anwar@example.com",
    });

    expect(userRepository.findById).toHaveBeenCalledWith("123");
  });
});
