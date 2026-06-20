import User from "../models/User.js";

export const createUser = async (data) => {
  return User.create(data);
};

export const findByEmail = async (email) => {
  return User.findOne({ email }).select("+password");
};

export const findById = async (id) => {
  return User.findById(id);
};

export const updateRefreshToken = async (userId, refreshToken) => {
  return User.findByIdAndUpdate(
    userId,
    {
      refreshToken,
    },
    {
      returnDocument: "after",
    },
  );
};

export const findByRefreshToken = async (refreshToken) => {
  return User.findOne({
    refreshToken,
  }).select("+refreshToken");
};

export const clearRefreshToken = async (userId) => {
  return User.findByIdAndUpdate(
    userId,
    {
      refreshToken: null,
    },
    {
      returnDocument: "after",
    },
  );
};
