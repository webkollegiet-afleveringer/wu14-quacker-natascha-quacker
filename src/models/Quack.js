import mongoose from "mongoose";

// define a schema for the Quack model with various fields and their types
const quackSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        // reference to the User model, which allows us to populate the author field with the full user data (username and avatar) when fetching quacks from the database
        // mongoose.Schema.Types.ObjectId returns the unique identifier for the user document that created the quack
        // ref: "User" tells Mongoose which model to use when populating this field with the actual user data.
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // text in the quack, which is required
    content: {
        type: String,
        required: true
    },
    // tags associated with the quack, which is an array of strings
    // displayed as hashtags after the quack content
    // tags will be extracted from the content of the quack by looking for words that start with "#" and removing the "#" symbol before storing them in the database
    tags: {
        type: Array,
        default: []
    },
    // media associated with the quack, which is an array of strings (e.g., URLs to images or videos)
    media: {
        type: Array,
        default: []
    },
    // arrays of user IDs who have viewed, liked, or reposted the quack, referencing the User model
    // views: [
    //     { 
    //         type: mongoose.Schema.Types.ObjectId, 
    //         ref: "User" 
    //     }
    // ],
    // likes: [
    //     { 
    //         type: mongoose.Schema.Types.ObjectId, 
    //         ref: "User" 
    //     }
    // ],
    // reposts: [
    //     { 
    //         type: mongoose.Schema.Types.ObjectId, 
    //         ref: "User" 
    //     }
    // ],
    // // array of comment objects, where each comment has a reference to the user who made the comment and the content of the comment
    // comments: [{
    //     user: { 
    //         type: mongoose.Schema.Types.ObjectId, 
    //         ref: "User" 
    //     },
    //     content: { 
    //         type: String, 
    //         required: true 
    //     }
    // }]
});

quackSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

// export the Quack model based on the quackSchema, allowing us to interact with the quacks collection in MongoDB
export const Quack = mongoose.model("Quack", quackSchema);