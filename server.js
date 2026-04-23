import app from "./app.js";

const PORT = process.env.PORT || 3000;

// start server after DB connection is established
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});