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
    following: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    messages: { type: Array, default: [] },
    quacks: { type: Array, default: [] },
    quacksRepliedTo: { type: Array, default: [] },
    media: { type: Array, default: [] },
    quacksLiked: { type: Array, default: [] }
});

export const User = mongoose.model("User", userSchema);