import { Comment } from "../models/comment.model.js";
import {Post} from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponce.js";

import mongoose, { isValidObjectId } from "mongoose";

// Add a comment to a post
const addComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid postId");
    }

    const postExists = await Post.findById(postId);
    if (!postExists) {
        throw new ApiError(404, "Post not found");
    }

    const comment = await Comment.create({
        post: postId,
        commentedBy: req.user._id,
        content
    });

    return res.status(201).json(new ApiResponse(201, comment));
});

// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.commentedBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment");
    }

    await comment.remove();

    return res.status(200).json(new ApiResponse(200, "Comment deleted successfully"));
});

// Get comments for a specific post
const getCommentsForPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid postId");
    }

    const comments = await Comment.find({ post: postId }).populate('commentedBy', 'username');

    return res.status(200).json(new ApiResponse(200, comments));
});

export { addComment, deleteComment, getCommentsForPost };
