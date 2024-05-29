import { Router } from "express";

import { followUser, getFollowers, getFollowing } from "../controllers/follow.controller.js";

const router = Router();

// Route to follow/unfollow a user
router.route('/follow').post( followUser);

// Route to get the list of followers for a user
router.route('/getFollowers').get(getFollowers);

// Route to get the list of users a user is following
router.route('/getFollowing').get(getFollowing);

const Followrouter = router;
export default Followrouter;