import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
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


userSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
    }
});

export const User = mongoose.model("User", userSchema);