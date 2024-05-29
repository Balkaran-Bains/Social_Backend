import mongoose, {Schema} from 'mongoose';

const likeSchema = new mongoose.Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Like = mongoose.model('Like', likeSchema);
