import {Like} from "../models/like.model.js";
import {Post} from "../models/post.model.js";




import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponce.js";
import { isValidObjectId } from "mongoose";

// Like a post 
const likePost = asyncHandler(async(req,res)=>{
    const { postId} = req.params;

    if (!isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid postId");
    }

    const postExists = await Post.findById(postId);
    if (!postExists) {
        throw new ApiError(404, "Post not found");
    }
    
    const likedAlready = await Like.findOne({
        post: postId,
        likedBy: req.user?._id,
    });

    if (likedAlready) {
        await Like.findByIdAndDelete(likedAlready?._id)

        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }));

    }

    await Like.create({
        post: postId,
        likedBy: req.user?._id,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }));
})

// Get total number of likes for a post
const getTotalLikesForPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid postId");
    }

    const totalLikes = await Like.countDocuments({ post: postId });

    return res.status(200).json(new ApiResponse(200, { totalLikes }));
});

export { getTotalLikesForPost, likePost };
