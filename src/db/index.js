import mongoose from "mongoose";

import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.URI}/${DB_NAME}`
    );
    console.log("\n mongodb is connected");
    console.log("\n db host", connectionInstance.connection.host);
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};

export default connectDB;
