import mongoose from "mongoose";
// import defaultAvatar from "../assets/default-avatar.png";

// define a schema for the User model with various fields and their types
const userSchema = new mongoose.Schema({
    name: String,
    username: { 
        type: String, 
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: String,
    avatar: { 
        type: String, 
        default: "https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630"
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
    quacks: [{
        // mongoose.Schema.Types.ObjectId returns the unique identifier (ObjectId = id of the quack document) for the quack document that the user has created
        type: mongoose.Schema.Types.ObjectId, 
        // ref is used to specify the model that this field references, so when an id is gotten from the ObjectId, Mongoose knows to look in the Quack collection to find the corresponding quack document and populate the user's quacks field with the full quack data instead of just the quack id's
        ref: "Quack" 
    }],
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