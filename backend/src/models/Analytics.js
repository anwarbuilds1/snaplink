import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
    },
    browser: String,
    os: String,
    device: String,
    country: String,
    referrer: String,
    clickedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Analytics = mongoose.model("Analytics", analyticsSchema);
export default Analytics;
