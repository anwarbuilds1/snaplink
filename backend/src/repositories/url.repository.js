import Url from "../models/Url.js";

export const createUrl = async (data) => {
  return Url.create(data);
};

export const findByShortCode = async (shortCode) => {
  return Url.findOne({ shortCode, isActive: true });
};

export const incrementClickCount = async (id) => {
  return Url.findByIdAndUpdate(
    id,
    {
      $inc: {
        clickCount: 1,
      },
    },
    {
      returnDocument: "after",
    },
  );
};
