import mongoose from "mongoose";

// define a schema for the User model with various fields and their types
const userSchema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    avatar: String,
    bio: String,
    joined: {
        type: Date,
        default: Date.now
    },
    following: {
        type: Number,
        default: 0
    },
    followers: {
        type: Number,
        default: 0
    },
    messages: { 
        type: Array, 
        default: [] 
    },
    quacks: { 
        type: Array, 
        default: [] 
    },
    quacksRepliedTo: { 
        type: Array, 
        default: [] 
    },
    media: { 
        type: Array, 
        default: [] 
    },
    quacksLiked: { 
        type: Array, 
        default: [] 
    }
});


// set the toJSON method to transform the output when converting a user document to JSON
// this removes sensitive fields like password and internal MongoDB fields, and adds an id field for easier access
userSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
    }
});

// export the User model based on the userSchema, allowing us to interact with the users collection in MongoDB
export const User = mongoose.model("User", userSchema);