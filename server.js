import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { connectDB } from "./src/config/db.js";
import { User } from "./src/models/User.js";
import { registerSchema } from "./src/validation/authSchema.js";


// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
// Allow CORS and parse JSON request bodies
app.use(cors());
// This middleware is necessary to parse JSON bodies in POST requests, which we need for the /users endpoint when registering new users.
// Without this, req.body would be undefined and we wouldn't be able to access the form data sent from the frontend.
app.use(express.json());

// get the port and JWT secret from environment variables, with defaults for development
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET;

// Connect to MongoDB
connectDB();


// get all quacks
// this endpoint is just a placeholder for now, since we haven't migrated the quacks data to MongoDB yet. Once we have the quacks in the database, we'll update this endpoint to fetch them from there instead of returning a static message.
app.get("/quacks", (req, res) => {
    res.json({ message: "Quacks endpoint (not migrated yet)" });
});


// register new user
app.post("/users", async (req, res) => {

    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            error: result.error.issues
        });
    }

    const { name, username, email, password } = result.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name: name || "",
        username,
        email,
        password: hashedPassword,
        avatar: "",
        bio: "",
        joined: new Date(),
        following: 0,
        followers: 0,
        messages: [],
        quacks: [],
        quacksRepliedTo: [],
        media: [],
        quacksLiked: []
    });

    const token = jwt.sign(
        { id: newUser._id, username: newUser.username },
        SECRET,
        { expiresIn: "7d" }
    );

    res.status(201).json({
        user: newUser,
        token
    });
});


// get all users (for testing purposes, not paginated or secure – only returns name, username, and email)
app.get("/users", async (req, res) => {
    const users = await User.find({}, "name username email");
    res.json({ users });
});


// get user by ID (for profile page) - this will be used to fetch the full user data when visiting a profile
app.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(400).json({ error: "Invalid user ID" });
    }
});


// start server after DB connection is established
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});