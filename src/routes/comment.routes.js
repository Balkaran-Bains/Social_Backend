import { Router } from 'express';
import { addComment, deleteComment,getCommentsForPost } from '../controllers/comment.controller.js';

const router = Router();

// Route to add a comment to a post
router.route('/addComment').post( addComment);

// Route to delete a comment
router.route('/cdeleteComment').delete( deleteComment);

// Route to get comments for a specific post
router.route('/getCommentsForPost').get(getCommentsForPost);

const CommentRouter = router;
export default CommentRouter;