// This file defines the controller functions for handling quack-related operations in our Express application.
// It imports the necessary models and libraries, and defines functions for creating quacks, fetching quack data, and updating/deleting quacks.

import mongoose from "mongoose";
import { Quack } from "../models/Quack.js";
import { User } from "../models/User.js";



// MARK: Get All Quacks
export const getQuacks = async (req, res) => {
    try {
        // find all quacks in the database
        const quacks = await Quack.find()
            // populate the author field of each quack with the corresponding user's username and avatar, so that we can display the author's information when fetching the quacks to display on the home page feed.
            .populate("author", "username avatar")
            // sort the quacks by createdAt in descending order (newest quacks first) to display the most recent quacks at the top of the home page feed.
            .sort({ createdAt: -1 });

        // return the quacks data as a JSON response to the client, which will be used to display the quacks on the home page feed.
        res.json({ quacks });
    }
    // if there's an error during the database query or any other part of the process, catch the error and return a 500 Internal Server Error response with an appropriate error message indicating that there was a server error while fetching the quacks.
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


// MARK: Create Quack
export const createQuack = async (req, res) => {
    
    try {
        // extract the content and media fields from the request body, which will be sent from the frontend when creating a new quack. These fields will be used to create a new quack document in the database.
        const { content, media } = req.body;

        // the protect middleware has already verified the JWT token and attached the decoded user information to the request object (req.user), so we can access the user's ID from req.user.id to associate the new quack with the user who created it.
        const userId = req.user.id;

        // find all tags in the content of the quack by looking for words that start with "#" and removing the "#" symbol before storing them in the database.
        // This allows us to extract hashtags from the quack content and store them as an array of tags in the quack document.
        // this way we can easily display the hashtags associated with each quack and potentially implement features like hashtag search or filtering in the future.
        const tags = content
            ? content.split(" ")
                .filter(word => word.startsWith("#"))
                .map(tag => tag.substring(1))
            : [];

        // create a new quack document in the database using the Quack model, with the author field set to the user's ID, and the content and media fields set to the values extracted from the request body.
        // This will save the new quack to the database and return the created quack document.
        const newQuack = await Quack.create({
            author: userId,
            content: content || "",
            tags: tags,
            media: media || [],
        });

        // after creating the new quack, find the user in the database by their ID.
        // This establishes the relationship between the user and their quacks, allowing us to easily fetch a user's quacks when we query for a user in the future.
        await User.findByIdAndUpdate(
            userId,
            {
                // $push is a MongoDB operator that adds a value to an array field in a document. In this case, we are pushing the ID of the newly created quack (newQuack._id) into the user's quacks array, which keeps track of all the quacks that the user has created.
                $push: { 
                    quacks: newQuack._id
                } 
            },
            {
                // returnDocument: "after" option tells Mongoose to return the updated user document after the update operation is performed, so that we can access the updated user data if needed
                // in this case we are not using the returned user data here, but we will fetch the users quacks on their profile page
                returnDocument: "after"
            }
        );

        // return a 201 Created response with the newly created quack data as a JSON response to the client, which will be used to update the home page feed with the new quack.
        res.status(201).json({ quack: newQuack });

    }
    // if there's an error during the quack creation process (database error, validation error, etc.), catch the error and return a 500 Internal Server Error response with an appropriate error message indicating that there was a server error while creating the quack.
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