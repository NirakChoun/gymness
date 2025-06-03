import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

if (!DB_URI) {
  throw new Error("Please define DB_URI environment variables inside .env");
}

const connectToDatabase = async () => {
  try {
    const conn = await mongoose.connect(DB_URI);
    console.log(`Connected to database: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting to database: ", error);
    process.exit(1);
  }
};

export default connectToDatabase;
