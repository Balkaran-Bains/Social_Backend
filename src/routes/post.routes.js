// post.routes.js
import { Router } from "express";
import { publishPost, getPostsByUserId, deletePost,getAllPosts } from "../controllers/post.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route('/uploadPost').post(
    upload.fields([
        {
            name: "postFile",
            maxCount: 1
        }
    ]),
    verifyJWT,
    publishPost
);

router.route('/getPostsByUserId').get(verifyJWT, getPostsByUserId);

router.route('/deletePost/:postId').delete(verifyJWT, deletePost);


// Add this route to get all posts
router.route('/getAllPosts').get(verifyJWT, getAllPosts);

export default router;
