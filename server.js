import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// helper til db.json
const getDB = () => {
    const data = fs.readFileSync("./db.json", "utf-8");
    return JSON.parse(data);
};

// Get all quacks
app.get("/quacks", (req, res) => {
    const db = getDB();
    res.json({ quacks: db.quacks });
});


app.post("/users", (req, res) => {
    const db = getDB();

    const { username, email, name, password } = req.body;

    if (!username || !email) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const newUser = {
        id: db.users.length + 1,
        username,
        email,
        name: name || "",
        password: password || "",
        avatar: "https://i.pravatar.cc/150",
        bio: "",
        joined: new Date().toISOString(),
        following: 0,
        followers: 0,
        messages: [],
        quacks: [],
        quacksReplies: [],
        media: [],
        likes: []
    };

    db.users.push(newUser);

    fs.writeFileSync("./db.json", JSON.stringify(db, null, 2));

    res.status(201).json(newUser);
});


// GET all users (light)
app.get("/users", (req, res) => {
    const db = getDB();

    const lightUsers = db.users.map(user => ({
        id: user.id,
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