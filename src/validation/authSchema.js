import { z } from "zod";
import { nameField, userNameField, emailField, passwordField } from "./formFields";


export const loginSchema = z.object({
    email: emailField,
    password: passwordField,
});


export const registerSchema = z.object({
    name: nameField,
    username: userNameField,
    email: emailField,
    password: passwordField,
    confirmPassword: z
        .string()
        .trim()
        .nonempty("Please confirm your password")
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});