import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
      index: true,
    },
    browser: {
      type: String,
    },
    os: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    referrer: {
      type: String,
      default: "direct",
    },
    clickedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

const Analytics = mongoose.model("Analytics", analyticsSchema);
export default Analytics;
