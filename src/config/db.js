import mongoose from "mongoose";

// const to use to connect to MongoDB
export const connectDB = async () => {
    try {
        // connect to MongoDB using the URL from environment variables
        await mongoose.connect(process.env.MONGO_URL);
        // log a message to the console if the connection is successful
        console.log("MongoDB connected");
    }
    catch (error) {
        // log any errors that occur during connection and exit the process with an error code
        console.error(error);
        // 1 indicates that the process exited with an error
        process.exit(1);
    }
};