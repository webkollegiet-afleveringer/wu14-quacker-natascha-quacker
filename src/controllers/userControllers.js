// import { User } from "../models/User.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// const SECRET = process.env.JWT_SECRET;

// // GET ALL USERS
// export const getUsers = async (req, res) => {
//     const users = await User.find({}, "name username email");
//     res.json({ users });
// };

// // GET USER BY ID
// export const getUserById = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);

//         if (!user) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         res.json(user);
//     } catch (err) {
//         res.status(400).json({ error: "Invalid user ID" });
//     }
// };

// // CHECK USERNAME (IMPORTANT FIX)
// export const checkUsername = async (req, res) => {
//     const username = req.query.username;

//     if (!username) {
//         return res.json({ exists: false });
//     }

//     const exists = await User.exists({ username });

//     res.json({ exists: !!exists });
// };

// // REGISTER USER
// export const registerUser = async (req, res) => {
//     try {
//         const { name, username, email, password } = req.body;

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = await User.create({
//             name,
//             username,
//             email,
//             password: hashedPassword,
//             avatar: "",
//             bio: "",
//             joined: new Date(),
//             following: 0,
//             followers: 0,
//             messages: [],
//             quacks: [],
//             quacksRepliedTo: [],
//             media: [],
//             quacksLiked: []
//         });

//         const token = jwt.sign(
//             { id: newUser._id, username: newUser.username },
//             SECRET,
//             { expiresIn: "7d" }
//         );

//         res.status(201).json({ user: newUser, token });

//     } catch (error) {
//         console.error(error);

//         if (error.code === 11000) {
//             const field = Object.keys(error.keyPattern)[0];
//             return res.status(400).json({
//                 field,
//                 message: `${field} already exists`
//             });
//         }

//         res.status(500).json({ message: "Server error" });
//     }
// };