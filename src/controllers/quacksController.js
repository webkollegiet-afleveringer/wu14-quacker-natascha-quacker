// This file defines the controller functions for handling quack-related operations in our Express application.
// It imports the necessary models and libraries, and defines functions for creating quacks, fetching quack data, and updating/deleting quacks.

import mongoose from "mongoose";
import { Quack } from "../models/Quack.js";
import { User } from "../models/User.js";



// MARK: Get All Quacks
export const getQuacks = async (req, res) => {
    try {
        const quacks = await Quack.find()
            .populate("author", "username avatar")
            // .sort({ createdAt: -1 });

        res.json({ quacks });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


// MARK: Create Quack
export const createQuack = async (req, res) => {
    
    try {
        const { content, media } = req.body;

        const userId = req.user.id;

        // const tags = quack.content
        // ?.match(/#\w+/g)
        // ?.map(tag => tag.slice(1)) || [];

        const newQuack = await Quack.create({
            author: userId,
            content: content || "",
            tags: [],
            media: media || [],
            // views: [],
            // likes: [],
            // reposts: [],
            // comments: []
        });

        console.log("NEW QUACK ID:", newQuack._id);
        console.log("PUSHING TO USER:", newQuack._id);

        await User.findByIdAndUpdate(
            userId,
            { 
                $push: { 
                    quacks: { 
                        _id: newQuack._id,
                        content: newQuack.content,
                        tags: newQuack.tags,
                        media: newQuack.media,
                        createdAt: newQuack.createdAt
                    } 
                } 
            },
            {
                returnDocument: "after"
            }
        );

        // await newQuack.populate("author", "username avatar");

        res.status(201).json({ quack: newQuack });

    }
    catch (err) {
        console.error("CREATE QUACK ERROR:", err);
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