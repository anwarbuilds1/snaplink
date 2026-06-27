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

export const updateRefreshToken = async (userId, refreshTokenHash) => {
  return User.findByIdAndUpdate(
    userId,
    {
      refreshTokenHash,
    },
    {
      returnDocument: "after",
    },
  );
};

export const findByRefreshToken = async (refreshTokenHash) => {
  return User.findOne({
    refreshTokenHash,
  }).select("+refreshTokenHash");
};

export const clearRefreshToken = async (userId) => {
  return User.findByIdAndUpdate(
    userId,
    {
      refreshTokenHash: null,
    },
    {
      returnDocument: "after",
    },
  );
};
