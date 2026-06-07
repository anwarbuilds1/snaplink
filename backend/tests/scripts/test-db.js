import mongoose from "mongoose";
import { connectDB } from "../../src/config/database.js";
import Url from "../../src/models/Url.js";

await connectDB();

const url = await Url.create({
  originalUrl: "https://google.com",
  shortCode: "test123",
});

console.log(url);

await mongoose.disconnect();
