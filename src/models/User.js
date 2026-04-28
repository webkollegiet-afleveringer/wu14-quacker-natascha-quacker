import mongoose from "mongoose";
import defaultAvatar from "../assets/default-avatar.png";

// define a schema for the User model with various fields and their types
const userSchema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    avatar: { 
        type: Object, 
        // set default to the default avatar that is also used in menu component, so that users who do not upload an avatar will have the default avatar displayed in their profile and in the header menu. This ensures consistency in the user experience, as all users without a custom avatar will have the same default image displayed across the application.
        // it will be possible to change the avatar in the users profile, and when a user uploads a new avatar, the avatar field will be updated with the new avatar data (example: URL to the uploaded image)
        default: { url: {defaultAvatar}, public_id: "" } 
    },
    bio: String,
    joined: {
        type: Date,
        default: Date.now
    },
    following: {
        type: Array,
        default: []
    },
    followers: {
        type: Array,
        default: []
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