import { Follow } from "../models/follower.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponce.js";
import mongoose, { isValidObjectId } from "mongoose";

// Follow or unfollow a user
const followUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    if (req.user._id.toString() === userId) {
        throw new ApiError(400, "You cannot follow yourself");
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
        throw new ApiError(404, "User not found");
    }

    const followingAlready = await Follow.findOne({
        follower: req.user._id,
        following: userId,
    });

    if (followingAlready) {
        await Follow.findByIdAndDelete(followingAlready._id);
        return res.status(200).json(new ApiResponse(200, { isFollowing: false }));
    }

    await Follow.create({
        follower: req.user._id,
        following: userId,
    });

    return res.status(200).json(new ApiResponse(200, { isFollowing: true }));
});

// Get the list of followers for a user
const getFollowers = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    const followers = await Follow.find({ following: userId }).populate('follower', 'username');

    return res.status(200).json(new ApiResponse(200, followers));
});

// Get the list of users a user is following
const getFollowing = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    const following = await Follow.find({ follower: userId }).populate('following', 'username');

    return res.status(200).json(new ApiResponse(200, following));
});

export { followUser, getFollowers, getFollowing };
