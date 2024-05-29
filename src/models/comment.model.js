import mongoose ,{Schema}from 'mongoose';

const commentSchema = new mongoose.Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    commentedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Comment = mongoose.model('Comment', commentSchema);
