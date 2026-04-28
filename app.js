// This file sets up the Express application, connects to the database, and defines the routes for the user-related operations. It also applies middleware for CORS and JSON parsing. The server will be started in server.js, which imports this app.

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import quacksRoutes from "./src/routes/quacksRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

import fs from "fs";




connectDB();

const app = express();

app.use(express.json());

app.use(cors());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("__dirname:", __dirname);
console.log("PUBLIC PATH:", path.join(__dirname, "public"));

app.use(
    "/images",
    express.static(path.join(__dirname, "public"))
);

// routes
// why this is not in userRoutes.js?
// - because this is the main app file where we define all routes for the application, and we import the userRoutes from the routes folder to keep our code organized and modular.
// This way, we can easily manage and scale our routes as our application grows, without cluttering the main app file with too many route definitions.
// By using app.use("/users", userRoutes), we are telling our Express app to use the userRoutes for any requests that start with "/users".
// This keeps our code clean and maintainable.
app.use("/users", userRoutes);

// we also need to define the routes for quacks, which will handle all quack-related operations (fetching quacks, creating quacks, etc.). We import the quacksRoutes from the routes folder and use it in our app, similar to how we set up the user routes.
app.use("/quacks", quacksRoutes);

app.get("/debug-image", (req, res) => {
    res.sendFile(path.join(__dirname, "public/default-avatar.png"));
});

console.log(
  "FILE EXISTS:",
  fs.existsSync(path.join(__dirname, "public/default-avatar.png"))
);


export default app;