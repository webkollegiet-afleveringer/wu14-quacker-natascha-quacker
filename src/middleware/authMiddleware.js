// This file defines a middleware function called "protect" that checks for a valid JWT token in the Authorization header of incoming requests.
// If the token is valid, it decodes the token and attaches the decoded user information to the request object, allowing protected routes to access the user's information.
// If the token is missing or invalid, it responds with a 401 Unauthorized status and an appropriate error message.

import jwt from "jsonwebtoken";

// get the JWT secret key from environment variables to use for signing and verifying tokens
const SECRET = process.env.JWT_SECRET;


// MARK: Protect Middleware
export const protect = (req, res, next) => {

    console.log("VERIFY SECRET:", SECRET);

    // check for the presence of the Authorization headers
    // (authHeader will be in the format "Bearer <token>")
    const authHeader = req.headers.authorization;

    // if the header is missing or doesn't start with "Bearer ", return a 401 Unauthorized response
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Not authorized"
        });
    }

    // if the header is present and starts with "Bearer ", extract the token and verify it
    try {
        // extract the token from the Authorization header and save it in token variable
        // split the header by space and take the second part <token> - authHeader.split(" ")[1]
        const token = authHeader.split(" ")[1];

        // verify the token using jwt.verify() method, which checks the token's signature and expiration against the secret key defined in our environment variables (SECRET)
        // when creating a new user, we sign a JWT token with the user's ID and username as the payload(content), using the secret key and setting an expiration time (e.g., 7 days).
        // when a request comes in with an Authorization header containing a token, we use jwt.verify() to check if the token is valid (that it was signed with the correct secret and hasn't expired).
        // if the token is valid, jwt.verify() returns the decoded payload (the user's information)
        const decoded = jwt.verify(token, SECRET);

        // use the decoded token to attach the user's information to the request object (req.user), so that protected routes can access the user's information (e.g., req.user.id, req.user.username) when handling the request
        req.user = decoded;

        // call next() to pass control to the next middleware function or route handler in the stack, allowing the request to proceed to the protected route if the token is valid
        next();

    }
    // if the token is invalid (e.g., expired, malformed, or signed with the wrong secret), jwt.verify() will throw an error, which we catch in the catch block below
    catch {
        res.status(401).json({
            message: "Invalid token"
        });
    }
};