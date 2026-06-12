import Url from "../models/Url.js";

export const createUrl = async (data) => {
  return Url.create(data);
};

export const updateUrl = async (id, data) => {
  return Url.findByIdAndUpdate(id, data, {
    new: true,
  });
};

export const deleteUrl = async (id) => {
  return Url.findByIdAndDelete(id);
};

export const findByShortCode = async (shortCode) => {
  return Url.findOne({
    shortCode,
    isActive: true,
  });
};

export const findByUserId = async (userId) => {
  return Url.find({ userId }).sort({ createdAt: -1 });
};

export const findByUserIdPaginated = async (userId, page, limit) => {
  const skip = (page - 1) * limit;

  return Url.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
};

export const countByUserId = async (userId) => {
  return Url.countDocuments({
    userId,
  });
};

export const findById = async (id) => {
  return Url.findById(id);
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

// Dashboard Analytics

export const getTotalUrls = async () => {
  return Url.countDocuments();
};

export const getTotalClicks = async () => {
  const result = await Url.aggregate([
    {
      $group: {
        _id: null,
        totalClicks: {
          $sum: "$clickCount",
        },
      },
    },
  ]);

  return result[0]?.totalClicks || 0;
};

export const getTopUrl = async () => {
  return Url.findOne().sort({ clickCount: -1 }).select("shortCode clickCount");
};
