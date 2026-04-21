const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const getDB = () => {
    const data = fs.readFileSync("./db.json", "utf-8");
    return JSON.parse(data);
};

// 🔥 HER er din users route
app.get("/users", (req, res) => {
    const db = getDB();

    const lightUsers = db.users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email
    }));

    res.json({ users: lightUsers });
});

// 🔥 HER er single user route
app.get("/users/:id", (req, res) => {
    const db = getDB();
    const id = Number(req.params.id);

    const user = db.users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
});

// 🔥 starter serveren
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});