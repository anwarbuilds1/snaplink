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
