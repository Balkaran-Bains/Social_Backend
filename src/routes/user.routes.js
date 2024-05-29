import { Router } from "express";
import { loginUser, logoutUser, registerUser, getUserByUsername } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount :1
        }
    ]),
    registerUser
)


router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)

router.route('/protected').get(verifyJWT, (req, res) => {
  res.json({
    message: 'You have accessed a protected route',
    user: {
      username: req.user.username,
      fullname: req.user.fullname,
      email: req.user.email,
      avatar: req.user.avatar, // Assuming you also want to include the avatar
      
    }
  });
});

// New route to get user profile by username
router.route('/:username').get(getUserByUsername);

export default router