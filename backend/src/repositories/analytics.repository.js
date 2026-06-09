import Analytics from "../models/Analytics.js";

export const createAnalyticsEvent = async (date) => {
  return Analytics.create(data);
};

export const getAnalyticsByUrlId = async (urlId) => {
  return Analytics.find({ urlId });
};
