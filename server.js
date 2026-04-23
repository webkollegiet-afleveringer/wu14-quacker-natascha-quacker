import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { connectDB } from "./src/config/db.js";
import { User } from "./src/models/User.js";
import { registerSchema } from "./src/validation/authSchema.js";

// MARK: API ENDPOINTS

// Load environment variables from .env file
dotenv.config();

console.log("🔥 SERVER STARTED - NEW DEPLOY ACTIVE");

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


// MARK: Get Users
// get all users (for testing purposes, not paginated or secure – only returns name, username, and email)
app.get("/users", async (req, res) => {
    const users = await User.find({}, "name username email");
    res.json({ users });
});


// MARK: Get User by ID
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


// MARK: Check Username Availability
app.get("/users/check-username", (req, res) => {
    console.log("🔥 CHECK USERNAME HIT");
    res.json({ exists: false });
});

// MARK: Register User
app.post("/users", async (req, res) => {

    try {
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

    }
    catch (error) {
        console.error(error);

        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];

            return res.status(400).json({
                field,
                message: `${field} already exists`
            });
        }

        res.status(500).json({
            message: "Server error"
        });
    }
});


// MARK: Login User
// app.post("/login", async (req, res) => {
    
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
    
//     if (!user) {
//         return res.status(401).json({ error: "Invalid credentials" });
//     }
    
//     const isMatch = await bcrypt.compare(password, user.password);
    
//     if (!isMatch) {
//         return res.status(401).json({ error: "Invalid credentials" });
//     }
    
//     const token = jwt.sign(
//         { id: user._id, email: user.email },
//         SECRET,
//         { expiresIn: "7d" }
//     );
    
//     res.json({
//         user,
//         token
//     });
// });


// MARK: Update User Profile
// method: PUT
// update user with this ID to update their profile information (name, username, email, password, avatar, bio) - this will be used for the edit profile page.
// app.put("/users/:id", (req, res) => {
//     res.json({ message: `Update user with ID ${req.params.id} (not implemented yet)` });
// });


// MARK: Delete User
// method: DELETE
// delete user with this ID - this will be used for account deletion
// only show in settings if the user is logged in
// only complete if user confirms by entering their password and confirming they want to delete their account
// only complete if the password is correct
// only complete if the user is authenticated and the ID in the token matches the ID in the URL
// app.delete("/users/:id", (req, res) => {
//     res.json({ message: `Delete user with ID ${req.params.id} (not implemented yet)` });
// });


// MARK: Follow User
// method: PUT
// update user with this ID
// add the following ID to this users following array and increment their following count
// add this users ID to the following users followers array and increment their followers count
// app.put("/users/:id/follow", (req, res) => {
//     res.json({ message: `Follow user with ID ${req.params.id} (not implemented yet)` });
// });


// MARK: Unfollow User
// method: PUT
// update user with this ID
// remove the following ID from this users following array and decrement their following count
// remove this users ID from the following users followers array and decrement their followers count
// app.put("/users/:id/unfollow", (req, res) => {
//     res.json({ message: `Unfollow user with ID ${req.params.id} (not implemented yet)` });
// });


// MARK: Get Quacks
// get all quacks (for home feed) - this will be used to fetch the quacks for the home feed, sorted by most recent and including the user data for each quack to display the avatar and username
// if a user is logged in and has liked a quack, this should also include that information to display the like button as active
// app.get("/quacks", (req, res) => {
//     res.json({ message: "Quacks endpoint (not migrated yet)" });
// });


// MARK: Get Quack by ID
// get quack by ID (for quack details page) - this will be used to fetch the full quack data when visiting a quack details page, including the user data for the author and any comments on the quack
// if a user is logged in and has liked this quack, this should also include that information to display the like button as active
// app.get("/quacks/:id", (req, res) => {
//     res.json({ message: `Quack with ID ${req.params.id} (not migrated yet)` });
// });


// MARK: Create New Quack
// method: POST
// add this to users quacks array and return the created quack
// add this to quacks collection with the user ID as the author (get avatar and username from the authenticated user to display on the quack) and the content from the request body
// app.post("/quacks", (req, res) => {
//     res.json({ message: "Create new quack (not implemented yet)" });
// });


// MARK: Like a Quack
// method: PUT
// update quack with this id to add the user ID to the quack's likes array and increment the like count
// also add this to users quacksLiked array
// app.put("/quacks/:id/likes", (req, res) => {
//     res.json({ message: `Like quack with ID ${req.params.id} (not implemented yet)` });
// });


// MARK: Comment on a Quack
// method: PUT
// update quack with this id to add a comment to the quack's comments array
// also add this to users quacksRepliedTo array
// app.put("/quacks/:id/comments", (req, res) => {
//     res.json({ message: `Comment on quack with ID ${req.params.id} (not implemented yet)` });
// });




// MARK: Start Server
// start server after DB connection is established
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});