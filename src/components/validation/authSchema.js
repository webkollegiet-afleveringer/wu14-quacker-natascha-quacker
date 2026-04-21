// import { z } from "zod";
// import { emailField, passwordField, nameField } from "./formFields";


// export const loginSchema = z.object({
//     email: emailField,
//     password: passwordField,
// });


// export const registerSchema = z.object({
//     name: nameField,
//     email: emailField,
//     password: passwordField,
//     confirmPassword: z
//         .string()
//         .trim()
//         .nonempty("Udfyld venligst bekræft password")
// })
// .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords matcher ikke",
//     path: ["confirmPassword"],
// });