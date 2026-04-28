// This file defines the routes for quack-related operations in our Express application.
// It imports the necessary controllers and sets up the endpoints for creating quacks, fetching quack data, and updating/deleting quacks.

import express from "express";
import {
    getQuacks,
    // getQuackById,
    createQuack
} from "../controllers/quacksController.js";
import { protect } from "../middleware/authMiddleware.js";


// MARK: ROUTES
// express.Router() allows us to create modular route handlers. We can define all user-related routes in this file and then export the router to be used in our main app.js file.
const router = express.Router();



// MARK: GET

// get all quacks (for home page) - this will be used to fetch all quacks to display on the home page feed
router.get("/", getQuacks);


// Dynamic Routes
// get quack by ID (for quack details page) - this will be used to fetch the full quack data when visiting a quack details page, to display the quack content and comments
// router.get("/:id", getQuackById);



// MARK: POST

// create new quack
router.post("/", protect, createQuack);




export default router;