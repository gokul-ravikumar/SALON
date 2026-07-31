import mongoose from "mongoose";

mongoose.set("strictQuery", true);

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);

    console.log(
      `MongoDB Connected: ${conn.connection.name}`
    );
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};