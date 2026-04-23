import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";


const SECRET = process.env.JWT_SECRET;


// MARK: Get All Users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, "name username email");
        res.json({ users });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};


// MARK: Check Username/Email
export const checkAvailability = async (req, res) => {
    try {
        const { username, email } = req.query;

        const response = {};

        if (username) {
            const cleanUsername = username.trim().toLowerCase();
            const existing = await User.findOne({ username: cleanUsername });
            response.usernameExists = !!existing;
        }

        if (email) {
            const cleanEmail = email.trim().toLowerCase();
            const existing = await User.findOne({ email: cleanEmail });
            response.emailExists = !!existing;
        }

        res.json(response);

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};


// MARK: Get User by ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({ user });

    } catch (err) {
        res.status(400).json({
            message: "Invalid user ID"
        });
    }
};


// MARK: Register User
export const registerUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        // 🔥 check duplicates (final safety layer)
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                field: "username",
                message: "Username is already taken"
            });
        }

        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({
                field: "email",
                message: "Email is already in use"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: name || "",
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password: hashedPassword,
            avatar: "",
            bio: "",
            joined: new Date(),
            following: 0,
            followers: 0,
            messages: [],
            quacks: [],
            quacksRepliedTo: [],
            media: [],
            quacksLiked: []
        });

        const token = jwt.sign(
            { id: newUser._id, username: newUser.username },
            SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            user: newUser,
            token
        });

    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


// MARK: Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(400).json({
                field: "email",
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                field: "password",
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            user,
            token
        });

    }
    catch (err) {
        res.status(500).json({
            message: "Server error"
        });
    }
};


// MARK: Get Current User
// export const getCurrentUser = async (req, res) => {
//     try {
//         const user = await User.findById(req.user.id).select("-password");

//         res.json({ user });

//     }
//     catch {
//         res.status(500).json({
//             message: "Server error"
//         });
//     }
// };
    

// MARK: Update User Profile
// method: PUT
// update user with this ID to update their profile information (name, username, email, password, avatar, bio) - this will be used for the edit profile page.
// app.put("/users/:id", (req, res) => {
//     res.json({ message: `Update user with ID ${req.params.id} (not implemented yet)` });
// });


// MARK: Delete User
// method: DELETE
// delete user with this ID - this will be used for account deletion
// only show in settings if the user is logged in
// only complete if user confirms by entering their password and confirming they want to delete their account
// only complete if the password is correct
// only complete if the user is authenticated and the ID in the token matches the ID in the URL
// app.delete("/users/:id", (req, res) => {
//     res.json({ message: `Delete user with ID ${req.params.id} (not implemented yet)` });
// });


// MARK: Follow User
// method: PUT
// update user with this ID
// add the following ID to this users following array and increment their following count
// add this users ID to the following users followers array and increment their followers count
// app.put("/users/:id/follow", (req, res) => {
//     res.json({ message: `Follow user with ID ${req.params.id} (not implemented yet)` });
// });


// MARK: Unfollow User
// method: PUT
// update user with this ID
// remove the following ID from this users following array and decrement their following count
// remove this users ID from the following users followers array and decrement their followers count
// app.put("/users/:id/unfollow", (req, res) => {
//     res.json({ message: `Unfollow user with ID ${req.params.id} (not implemented yet)` });
// });


// MARK: Get Quacks
// get all quacks (for home feed) - this will be used to fetch the quacks for the home feed, sorted by most recent and including the user data for each quack to display the avatar and username
// if a user is logged in and has liked a quack, this should also include that information to display the like button as active
// app.get("/quacks", (req, res) => {
//     res.json({ message: "Quacks endpoint (not migrated yet)" });
// });


// MARK: Get Quack by ID
// get quack by ID (for quack details page) - this will be used to fetch the full quack data when visiting a quack details page, including the user data for the author and any comments on the quack
// if a user is logged in and has liked this quack, this should also include that information to display the like button as active
// app.get("/quacks/:id", (req, res) => {
//     res.json({ message: `Quack with ID ${req.params.id} (not migrated yet)` });
// });


// MARK: Create New Quack
// method: POST
// add this to users quacks array and return the created quack
// add this to quacks collection with the user ID as the author (get avatar and username from the authenticated user to display on the quack) and the content from the request body
// app.post("/quacks", (req, res) => {
//     res.json({ message: "Create new quack (not implemented yet)" });
// });


// MARK: Like a Quack
// method: PUT
// update quack with this id to add the user ID to the quack's likes array and increment the like count
// also add this to users quacksLiked array
// app.put("/quacks/:id/likes", (req, res) => {
//     res.json({ message: `Like quack with ID ${req.params.id} (not implemented yet)` });
// });


// MARK: Comment on a Quack
// method: PUT
// update quack with this id to add a comment to the quack's comments array
// also add this to users quacksRepliedTo array
// app.put("/quacks/:id/comments", (req, res) => {
//     res.json({ message: `Comment on quack with ID ${req.params.id} (not implemented yet)` });
// });