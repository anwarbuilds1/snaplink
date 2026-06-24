import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
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

// Analytics queries by URL sorted by time
analyticsSchema.index({
  urlId: 1,
  clickedAt: -1,
});

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;
