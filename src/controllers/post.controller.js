import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";

// Create New Post
const publishPost = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required !!");
    }

    const postFileLocalPath = req.files?.postFile[0]?.path;

    if (!postFileLocalPath) {
        throw new ApiError(400, "Post file is required !");
    }

    const postFile = await uploadonCloudinary(postFileLocalPath);

    if (!postFile) {
        throw new ApiError(500, "Uploading Failed");
    }

    const post = await Post.create({
        content,
        postFile : postFile.url,
         user: req.user._id,
    });

    const postUploaded = await Post.findById(post._id);

    if (!postUploaded) {
        throw new ApiError(500, "Uploading Failed, try again !!");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                post,
                "Post Uploaded Successfully"
            )
        );
});

// Get all Posts By User ID
const getPostsByUserId = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const posts = await Post.find({ user: userId }).populate('user').sort({ createdAt: -1 });

    if (!posts.length) {
        throw new ApiError(404, "No post found for this user");
    }

    res.status(200).json(new ApiResponse(200, posts, "Posts retrieved successfully"));
});

// Delete a post
const deletePost = asyncHandler(async (req, res) => {
    try {
        const { postId } = req.params;
        console.log('Received request to delete post with ID:', postId);

        const post = await Post.findById(postId);
        if (!post) {
            console.error('Post not found for ID:', postId);
            throw new ApiError(404, "Post not found");
        }

        if (post.user.toString() !== req.user._id.toString()) {
            console.error('Unauthorized attempt to delete post by user:', req.user._id);
            throw new ApiError(403, "You are not authorized to delete this post");
        }

        await post.deleteOne();
        console.log('Post deleted successfully for ID:', postId);
        
        res.status(200).json(new ApiResponse(200, {}, "Post deleted successfully"));
    } catch (error) {
        console.error('Error deleting post:', error.message || error);
        res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, {}, error.message || 'Internal Server Error'));
    }
});

// Get all posts of all the users 
const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({}).populate('user').sort({ createdAt: -1 });

    if (!posts.length) {
        throw new ApiError(404, "No posts found");
    }

    res.status(200).json(new ApiResponse(200, posts, "All posts retrieved successfully"));
});


export {
    publishPost,
    getPostsByUserId,
    deletePost,
    getAllPosts
};
