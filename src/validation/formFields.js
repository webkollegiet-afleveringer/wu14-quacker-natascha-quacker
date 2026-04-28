import { z } from "zod";


export const nameField = z
    .string()
    .trim()
    .nonempty("Please fill in your name")
    .max(100, "Name must not be longer than 100 characters")
    // can not contain numbers or special characters
    .regex(/^[a-zA-ZæøåÆØÅ\s]+$/, "Name must not contain numbers or special characters");

export const userNameField = z
    .string()
    .trim()
    .nonempty("Please fill in your username")
    .max(100, "Username must not be longer than 100 characters")


export const emailField = z
    .string()
    .trim()
    .nonempty("Please fill in your email")
    .email("Invalid email");


export const passwordField = z
    // must be a string
    .string()
    // remove whitespace from both ends of the string
    .trim()
    // must not be empty
    .nonempty("Please fill in your password")
    // must be at least 6 characters long
    .min(6, "Password must be at least 6 characters long")
    // must contain at least one uppercase letter
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // must contain at least one lowercase letter
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    // must contain at least one number
    .regex(/[0-9]/, "Password must contain at least one number")
    // must contain at least one special character
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character");


// content field for creating a quack
export const contentField = z
    .string()
    .trim()
    .max(300, "Content must not be longer than 300 characters")
    .optional();

// media field for creating a quack, optional, must be a string (url or base64), can be empty
export const mediaField = z
    .string()
    .trim()
    .optional();