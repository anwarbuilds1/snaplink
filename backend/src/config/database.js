import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
  if (!env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  try {
    await mongoose.connect(env.MONGODB_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database Connection Failed");
    console.error(error.message);

    process.exit(1);
  }
};
