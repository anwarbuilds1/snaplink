import mongoose from "mongoose";

const analyticsSummarySchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
      index: true,
    },

    date: {
      type: String,
      required: true,
      index: true,
    },

    totalClicks: {
      type: Number,
      default: 0,
    },

    browsers: {
      type: Map,
      of: Number,
      default: {},
    },

    operatingSystems: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

analyticsSummarySchema.index(
  {
    urlId: 1,
    date: 1,
  },
  {
    unique: true,
  },
);

const AnalyticsSummary = mongoose.model(
  "AnalyticsSummary",
  analyticsSummarySchema,
);

export default AnalyticsSummary;
