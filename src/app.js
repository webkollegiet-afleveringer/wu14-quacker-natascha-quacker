import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/users", userRoutes);

export default app;