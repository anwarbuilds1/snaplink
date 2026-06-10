import mongoose from "mongoose";
import Analytics from "../models/Analytics.js";

export const createAnalyticsEvent = async (data) => {
  return Analytics.create(data);
};

export const getAnalyticsByUrlId = async (urlId) => {
  const objectId = new mongoose.Types.ObjectId(urlId);

  return Analytics.find({
    urlId: objectId,
  });
};

export const getBrowserStats = async (urlId) => {
  const objectId = new mongoose.Types.ObjectId(urlId);

  return Analytics.aggregate([
    {
      $match: {
        urlId: objectId,
      },
    },
    {
      $group: {
        _id: "$browser",
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);
};

export const getOsStats = async (urlId) => {
  const objectId = new mongoose.Types.ObjectId(urlId);

  return Analytics.aggregate([
    {
      $match: {
        urlId: objectId,
      },
    },
    {
      $group: {
        _id: "$os",
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);
};
