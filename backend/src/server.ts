import dotenv from "dotenv";

dotenv.config();

import "./types/express";
import { connectDB } from "./config/db";
import app from "./app";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
