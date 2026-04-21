// import { z } from "zod";


// export const nameField = z
//     .string()
//     .trim()
//     .nonempty("Udfyld venligst navn")
//     .max(100, "Navn må ikke være længere end 100 tegn")
//     // can not contain numbers or special characters
//     .regex(/^[a-zA-ZæøåÆØÅ\s]+$/, "Navn må ikke indeholde tal eller specialtegn");


// export const emailField = z
//     .string()
//     .trim()
//     .nonempty("Udfyld venligst email")
//     .email("Ugyldig email");


// export const subjectField = z
//     .string()
//     .trim()
//     .nonempty("Udfyld venligst emne")
//     .max(100, "Emne må ikke være længere end 100 tegn")
//     // can not contain special characters
//     .regex(/^[a-zA-ZæøåÆØÅ0-9\s]+$/, "Emne må ikke indeholde specialtegn");


// export const messageField = z
//     .string()
//     .trim()
//     .nonempty("Udfyld venligst besked")
//     .max(1000, "Besked må ikke være længere end 1000 tegn");


// export const passwordField = z
//     // must be a string
//     .string()
//     // remove whitespace from both ends of the string
//     .trim()
//     // must not be empty
//     .nonempty("Udfyld venligst password")
//     // must be at least 6 characters long
//     .min(6, "Password skal være mindst 6 tegn")
//     // must contain at least one uppercase letter
//     .regex(/[A-Z]/, "Password skal indeholde mindst et stort bogstav")
//     // must contain at least one lowercase letter
//     .regex(/[a-z]/, "Password skal indeholde mindst et lille bogstav")
//     // must contain at least one number
//     .regex(/[0-9]/, "Password skal indeholde mindst et nummer")
//     // must contain at least one special character
//     .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password skal indeholde mindst et specialtegn");