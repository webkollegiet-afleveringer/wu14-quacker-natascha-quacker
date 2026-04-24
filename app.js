// This file sets up the Express application, connects to the database, and defines the routes for the user-related operations. It also applies middleware for CORS and JSON parsing. The server will be started in server.js, which imports this app.

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// routes
// why this is not in userRoutes.js?
// - because this is the main app file where we define all routes for the application, and we import the userRoutes from the routes folder to keep our code organized and modular.
// This way, we can easily manage and scale our routes as our application grows, without cluttering the main app file with too many route definitions.
// By using app.use("/users", userRoutes), we are telling our Express app to use the userRoutes for any requests that start with "/users".
// This keeps our code clean and maintainable.
app.use("/users", userRoutes);

export default app;