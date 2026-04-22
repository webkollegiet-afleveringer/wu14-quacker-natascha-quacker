import express from "express";
import cors from "cors";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { registerSchema } from "./src/validation/authSchema.js";

const SECRET = "supersecretkey";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Helper function to read the database
const getDB = () => {
    const data = fs.readFileSync("./db.json", "utf-8");
    return JSON.parse(data);
};

// Get all quacks
app.get("/quacks", (req, res) => {
    const db = getDB();
    res.json({ quacks: db.quacks });
});

// Create a new user
app.post("/users", async (req, res) => {
    const db = getDB();

    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            error: result.error.issues
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: db.users.length + 1,
        name: name || "",
        username,
        email,
        password: hashedPassword,
        avatar: "",
        bio: "",
        joined: new Date().toISOString(),
        following: 0,
        followers: 0,
        messages: [],
        quacks: [],
        quacksRepliedTo: [],
        media: [],
        quacksLiked: []
    };

    db.users.push(newUser);
    fs.writeFileSync("./db.json", JSON.stringify(db, null, 2));

    // generate JWT token
    const token = jwt.sign(
        { id: newUser.id, username: newUser.username },
        SECRET,
        { expiresIn: "7d" }
    );

    res.status(201).json({
        user: newUser,
        token
    });
});


// GET all users (light)
app.get("/users", (req, res) => {
    const db = getDB();

    const lightUsers = db.users.map(user => ({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email
    }));

    res.json({ users: lightUsers });
});

// GET single user (full)
app.get("/users/:id", (req, res) => {
    const db = getDB();
    const id = Number(req.params.id);

    const user = db.users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});