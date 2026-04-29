// This file contains the controller functions for handling user-related operations in the Quacker application, such as getting users, registering a new user, logging in, etc.
// Each function corresponds to a specific route and HTTP method defined in the Express server (userRoutes.js) (GET /users, POST /register, POST /login).
// The controllers interact with the User model (User.js) to perform database operations and return appropriate responses based on the outcome of those operations.

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// get the JWT secret key from environment variables to use for signing and verifying tokens
const SECRET = process.env.JWT_SECRET;


// MARK: Get All Users
export const getUsers = async (req, res) => {
    try {
        // find all users and return only their name, username, and email (exclude password and other sensitive information)
        const users = await User.find({}, "name username email");
        // return the list of users as a JSON response
        res.json({ users });
    }
    // if there's an error during the database query or any other part of the process, catch the error and return a 500 Internal Server Error response with a generic error message
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};


// MARK: Check Username/Email
export const checkAvailability = async (req, res) => {
    try {
        // extract the username and email query parameters from the request URL (e.g., /check-availability?username=john&email=john@example.com)
        const { username, email } = req.query;

        // initialize an empty response object that will be populated with the results of the availability checks for the username and email
        const response = {};

        // if username query parameter is provided
        if (username) {
            // clean the username by trimming whitespace and converting to lowercase to ensure consistent checks (" John " becomes "john")
            const cleanUsername = username.trim().toLowerCase();
            // query the database to find a user with the cleaned username
            const existing = await User.findOne({ username: cleanUsername });
            // set the usernameExists property of the response object to true if a user with that username exists, or false if it doesn't
            // (using !! to convert the result to a boolean)
            response.usernameExists = !!existing;
        }

        // if email query parameter is provided
        if (email) {
            // clean the email by trimming whitespace and converting to lowercase to ensure consistent checks
            const cleanEmail = email.trim().toLowerCase();
            // query the database to find a user with the cleaned email
            const existing = await User.findOne({ email: cleanEmail });
            // set the emailExists property of the response object to true if a user with that email exists, or false if it doesn't
            // (using !! to convert the result to a boolean)
            response.emailExists = !!existing;
        }

        // return the response object as a JSON response, which will indicate whether the username and/or email already exist in the database
        // ({ usernameExists: true, emailExists: false })
        res.json(response);

    }
    // if there's an error during the database queries or any other part of the process, catch the error and return a 500 Internal Server Error response with a generic error message
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};


// MARK: Get User by ID
export const getUserById = async (req, res) => {
    try {
        // extract the user ID from the request parameters
        // (/users/12345 - req.params.id will be "12345")
        const { id } = req.params;

        // query the database to find a user with the specified ID, and exclude the password field from the returned user data for security reasons (using .select("-password"))
        const user = await User.findById(id).select("-password");

        // if no user is found with the specified ID, return a 404 Not Found response with an appropriate error message
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // return the user data as a JSON response (excluding the password field)
        res.json({ user });

    }
    // if there's an error during the database query (e.g., invalid ID format) or any other part of the process, catch the error and return a 400 Bad Request response with an appropriate error message indicating that the user ID is invalid
    catch (err) {
        res.status(400).json({
            message: "Invalid user ID"
        });
    }
};


// MARK: Register User
export const registerUser = async (req, res) => {
    try {
        // extract the name, username, email, and password from the request body (sent by the client when registering a new user)
        const { name, username, email, password } = req.body;

        // check if a user with the same username already exists in the database by querying the User model for a document with the specified username
        const existingUser = await User.findOne({ username });

        // if a user with the same username is found, return a 400 Bad Request response with an appropriate error message indicating that the username is already taken
        if (existingUser) {
            return res.status(400).json({
                field: "username",
                message: "Username is already taken"
            });
        }

        // check if a user with the same email already exists in the database by querying the User model for a document with the specified email
        const existingEmail = await User.findOne({ email });

        // if a user with the same email is found, return a 400 Bad Request response with an appropriate error message indicating that the email is already in use
        if (existingEmail) {
            return res.status(400).json({
                field: "email",
                message: "Email is already in use"
            });
        }

        // hash the password using bcrypt.hash() method, which takes the plain text password and a salt rounds value (10 in this case) to generate a secure hashed version of the password that can be safely stored in the database without exposing the original password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create a new user document in the database using the User model's create() method, passing in an object with the user's information (name, username, email, hashed password, and default values for other fields like avatar, bio, joined date, following/followers count, messages, quacks, etc.)
        const newUser = await User.create({
            name: name || "",
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password: hashedPassword,
            bio: "",
            joined: new Date(),
            following: [],
            followers: [],
            messages: [],
            quacks: [],
            quacksRepliedTo: [],
            media: [],
            quacksLiked: []
        });

        // generate a JWT token for the newly registered user using jwt.sign() method, 
        // which takes a payload (an object containing the user's ID and username),
        // the secret key (SECRET), 
        // and an options object that sets the token's expiration time (7 days in this case)
        // sign the token with the user's ID and username as the payload, using the secret key and setting an expiration time (e.g., 7 days).
        // console.log("SIGN SECRET:", process.env.JWT_SECRET);
        const token = jwt.sign(
            { id: newUser._id, username: newUser.username },
            SECRET,
            { expiresIn: "7d" }
        );

        // return a 201 Created response with a JSON object containing the newly created user data (excluding the password) and the generated JWT token, which the client can use for authentication in subsequent requests
        res.status(201).json({
            user: newUser,
            token
        });

    }
    // if there's an error during the user creation process or any other part of the process, catch the error and return a 500 Internal Server Error response with a generic error message indicating that there was a server error
    catch (err) {
        // console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


// MARK: Login User
export const loginUser = async (req, res) => {
    try {
        // extract the email and password from the request body (sent by the client when logging in)
        const { email, password } = req.body;

        // query the database to find a user with the specified email by using the User model's findOne() method, and convert the email to lowercase to ensure consistent checks
        // ("john@example.com" and "JOHN@EXAMPLE.COM" are treated as the same)
        const user = await User.findOne({
            email: email.toLowerCase()
        });

        // if no user is found with the specified email, return a 400 Bad Request response with an appropriate error message indicating that the email or password is invalid (without specifying which one for security reasons)
        if (!user) {
            return res.status(400).json({
                field: "email",
                message: "Invalid email or password"
            });
        }

        // use bcrypt.compare() method to compare the provided plain text password with the hashed password stored in the database for the user, which returns a boolean indicating whether the passwords match
        const isMatch = await bcrypt.compare(password, user.password);

        // if the passwords do not match, return a 400 Bad Request response with an appropriate error message indicating that the email or password is invalid (without specifying which one for security reasons)
        if (!isMatch) {
            return res.status(400).json({
                field: "password",
                message: "Invalid email or password"
            });
        }

        // if the email exists and the password matches, generate a JWT token for the authenticated user using jwt.sign() method, which takes a payload (an object containing the user's ID and username), the secret key (SECRET), and an options object that sets the token's expiration time (7 days in this case)
        // sign the token with the user's ID and username as the payload, using the secret key and setting an expiration time (7 days).
        // console.log("SIGN SECRET:", process.env.JWT_SECRET);
        const token = jwt.sign(
            { id: user._id, username: user.username },
            SECRET,
            { expiresIn: "7d" }
        );

        // return a JSON response containing the authenticated user data (excluding the password) and the generated JWT token, which the client can use for authentication in subsequent requests
        res.json({
            user,
            token
        });

    }
    // if there's an error during the login process or any other part of the process, catch the error and return a 500 Internal Server Error response with a generic error message indicating that there was a server error
    catch (err) {
        res.status(500).json({
            message: "Server error"
        });
    }
};


// MARK: Get Current User
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        .select("-password")
        .populate("quacks", "content tags media createdAt");

        res.json({ user });

    }
    catch {
        res.status(500).json({
            message: "Server error"
        });
    }
};


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