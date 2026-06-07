require("dotenv").config();

const env = {
  port: process.env.PORT || "5000",
  mongoUri: process.env.MONGO_URI,
  redisUrl: process.env.REDIS_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  baseUrl: process.env.BASE_URL || "http://localhost:5000",
  nodeEnv: process.env.NODE_ENV || "development",
};

module.exports = env;
