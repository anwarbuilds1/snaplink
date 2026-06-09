import Analytics from "../models/Analytics.js";

export const createAnalyticsEvent = async (data) => {
  return Analytics.create(data);
};

export const getAnalyticsByUrlId = async (urlId) => {
  return Analytics.find({ urlId });
};
