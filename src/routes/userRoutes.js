import express from "express";
import {
    getUsers,
    getUserById,
    checkAvailability,
    registerUser
} from "../controllers/userController.js";


// MARK: ROUTES
// express.Router() allows us to create modular route handlers. We can define all user-related routes in this file and then export the router to be used in our main app.js file.
const router = express.Router();



// MARK: GET

// get all users (for admin panel - not currently used in frontend, but could be useful for future features like admin dashboard)
router.get("/", getUsers);


// IMPORTANT: This route must be defined before the "/:id" route to avoid conflicts
// "check-availability" could be mistakenly treated as an ID.
// By placing it first, we ensure that requests to "/users/check-availability" are correctly routed to the checkAvailability controller, while still allowing valid user ID requests to be handled by the getUserById controller.
router.get("/check-availability", checkAvailability);


// get user by ID (for profile page) - this will be used to fetch the full user data when visiting a profile
router.get("/:id", getUserById);



// MARK: POST

// register new user
router.post("/", registerUser);

// router.post("/login", loginUser)



export default router;