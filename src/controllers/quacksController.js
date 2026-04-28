// This file defines the controller functions for handling quack-related operations in our Express application.
// It imports the necessary models and libraries, and defines functions for creating quacks, fetching quack data, and updating/deleting quacks.

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Quack } from "../models/Quack.js";



// MARK: Get All Quacks
// export const getQuacks = async (req, res) => {
//     try {
//         const quacks = await Quack.find()
//             .populate("user", "username avatar")
//             .sort({ createdAt: -1 })
//             .limit(50);

//         res.json({ quacks });
//     }
//     catch (err) {
//         res.status(500).json({ message: "Server error" });
//     }
// };
export const getQuacks = async (req, res) => {
    try {
        const quacks = await Quack.find()
            .populate("author", "username avatar")
            .sort({ createdAt: -1 });

        res.json({ quacks });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


// // MARK: Get Quack by ID
// export const getQuackById = async (req, res) => {
//     try {
//         // extract the quack ID from the request parameters
//         // (/quacks/12345 - req.params.id will be "12345")
//         const { id } = req.params;

//         // query the database to find a quack with the specified ID
//         const quack = await Quack.findById(id)
//             .populate("user", "username avatar");

//         // if no quack is found with the specified ID, return a 404 Not Found response with an appropriate error message
//         if (!quack) {
//             return res.status(404).json({
//                 message: "Quack not found"
//             });
//         }

//         // return the quack data as a JSON response
//         res.json({ quack });

//     }
//     // if there's an error during the database query (e.g., invalid ID format) or any other part of the process, catch the error and return a 400 Bad Request response with an appropriate error message indicating that the quack ID is invalid
//     catch (err) {
//         if (err.name === "CastError") {
//             return res.status(400).json({
//                 message: "Invalid quack ID"
//             });
//         }

//         res.status(500).json({
//             message: "Server error"
//         });
//     }
// };


// MARK: Create Quack
export const createQuack = async (req, res) => {
    try {
        const { quack } = req.body;

        const newQuack = await Quack.create({
            createdAt: Date.now(),
            author: req.user.id || req.user._id,
            quack: {
                content: quack.content || "",
                tags: [],
                media: quack.media || [],
                views: [],
                likes: [],
                reposts: [],
                comments: []
            }
        });

        await newQuack.populate("author", "username avatar");

        res.status(201).json({ quack: newQuack });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};