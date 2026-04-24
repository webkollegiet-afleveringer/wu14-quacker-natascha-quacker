// This file is the entry point of the server.
// It imports the Express app from app.js and starts the server on a specified port.
// The server will only start after a successful connection to the database is established in app.js.

import app from "./app.js";

const PORT = process.env.PORT || 3000;

// start server after DB connection is established
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});