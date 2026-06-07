import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/database.js";

// import Url from "./models/Url.js";
// import User from "./models/User.js";
// import Analytics from "./models/Analytics.js";
const startServer = async () => {
  await connectDB();

  // console.log(Url.modelName);
  // console.log(User.modelName);
  // console.log(Analytics.modelName);

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

startServer();
