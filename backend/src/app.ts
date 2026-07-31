import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Salon API Running");
});

app.use("/auth", authRoutes);

app.use(errorHandler);

export default app;