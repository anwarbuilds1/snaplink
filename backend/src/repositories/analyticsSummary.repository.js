import AnalyticsSummary from "../models/AnalyticsSummary.js";

export const upsertSummary = async (summary) => {
  return AnalyticsSummary.findOneAndUpdate(
    {
      urlId: summary.urlId,
      date: summary.date,
    },
    summary,
    {
      upsert: true,
      new: true,
    },
  );
};

export const getSummaryByUrlId = async (urlId) => {
  return AnalyticsSummary.find({
    urlId,
  }).sort({
    date: -1,
  });
};
