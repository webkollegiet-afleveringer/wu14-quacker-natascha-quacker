// This file defines the controller functions for handling quack-related operations in our Express application.
// It imports the necessary models and libraries, and defines functions for creating quacks, fetching quack data, and updating/deleting quacks.

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Quacks } from "../models/Quacks.js";



// MARK: Get All Quacks
export const getQuacks = async (req, res) => {
    try {
        // find all quacks and return them as a JSON response
        const quacks = await Quacks.find();
        // return the list of quacks as a JSON response
        res.json({ quacks });
    }
    // if there's an error during the database query or any other part of the process, catch the error and return a 500 Internal Server Error response with a generic error message
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};


// MARK: Get Quack by ID
export const getQuackById = async (req, res) => {
    try {
        // extract the quack ID from the request parameters
        // (/quacks/12345 - req.params.id will be "12345")
        const { id } = req.params;

        // query the database to find a quack with the specified ID
        const quack = await Quacks.findById(id);

        // if no quack is found with the specified ID, return a 404 Not Found response with an appropriate error message
        if (!quack) {
            return res.status(404).json({
                message: "Quack not found"
            });
        }

        // return the quack data as a JSON response
        res.json({ quack });

    }
    // if there's an error during the database query (e.g., invalid ID format) or any other part of the process, catch the error and return a 400 Bad Request response with an appropriate error message indicating that the quack ID is invalid
    catch (err) {
        res.status(400).json({
            message: "Invalid quack ID"
        });
    }
};


// MARK: Create Quack
export const createQuack = async (req, res) => {
    try {
        // extract the content from the request body (sent by the client when creating a new quack)
        const { content } = req.body;

        // create a new quack document in the database using the Quacks model's create() method, passing in an object with the quack's content and default values for other fields
        const newQuack = await Quacks.create({
            // SET THIS UP BY USING STRUCTURE OF QUACK MODEL
            // The author should be the ID of the currently logged in user, which we can get from the authentication middleware (e.g., req.user.id)
            // do i need to import the auth middleware here to access req.user? or is it already available in the controller functions?
            // 
            // author: req.user.id,

            content: content || "",
            likes: 0,
            replies: 0,
            timestamp: new Date()
        });

        // return the newly created quack data as a JSON response
        res.status(201).json({ quack: newQuack });
    }
    // if there's an error during the database query or any other part of the process, catch the error and return a 500 Internal Server Error response with a generic error message
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};