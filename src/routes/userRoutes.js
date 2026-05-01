// This file defines the routes for user-related operations in our Express application.
// It imports the necessary controllers and middleware, and sets up the endpoints for user registration, login, fetching user data, and checking username/email availability.

import express from "express";
import {
    getUsers,
    getUserById,
    checkAvailability,
    registerUser,
    loginUser,
    getCurrentUser
} from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";


// MARK: ROUTES
// express.Router() allows us to create modular route handlers. We can define all user-related routes in this file and then export the router to be used in our main app.js file.
const router = express.Router();



// MARK: GET

// get all users (for admin panel - not currently used in frontend, but could be useful for future features like admin dashboard)
router.get("/", getUsers);


// Specific Routes
// IMPORTANT: These route must be defined before the "/:id" route to avoid conflicts

// "check-availability" could be mistakenly treated as an ID.
// By placing it first, we ensure that requests to "/users/check-availability" are correctly routed to the checkAvailability controller, while still allowing valid user ID requests to be handled by the getUserById controller.
router.get("/check-availability", checkAvailability);

// get current user (for settings page) - this will be used to fetch the current logged in user data when visiting the settings page, to pre-fill the form with their existing information
router.get("/me", protect, getCurrentUser);


// Dynamic Routes
// get user by ID (for profile page) - this will be used to fetch the full user data when visiting a profile
router.get("/:id", getUserById);



// MARK: POST

// register new user
router.post("/", registerUser);

// login user
router.post("/login", loginUser);




export default router;