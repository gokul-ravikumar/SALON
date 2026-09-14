import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import serviceRoutes from "./routes/service.routes";
import staffRoutes from "./routes/staff.routes"
import categoryRoutes from "./routes/category.routes"
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Salon API Running");
});

app.use("/auth", authRoutes);
app.use("/services", serviceRoutes);
app.use("/staff",staffRoutes)
app.use("/category",categoryRoutes)

app.use(errorHandler);

export default app;