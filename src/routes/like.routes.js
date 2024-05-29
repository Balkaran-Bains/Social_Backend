import { Router } from "express";
import { getTotalLikesForPost, likePost } from "../controllers/like.controller.js";

const router = Router();

router.route('/likepost').post( likePost );

router.route('/getTotalLikes').get( getTotalLikesForPost);

const Likerouter = router;
export default Likerouter;