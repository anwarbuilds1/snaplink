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

  const result = await Analytics.aggregate([
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
  ]);

  console.log("Browser Stats:", result);

  return result;
};

export const getOsStats = async (urlId) => {
  const objectId = new mongoose.Types.ObjectId(urlId);

  const result = await Analytics.aggregate([
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
  ]);

  console.log("OS Stats:", result);

  return result;
};
