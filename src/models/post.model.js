import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  postFile: {
    type: String,
  },

  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],

  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],


}, 
{
  timestamps: true,
}
);

export const Post = mongoose.model('Post', postSchema);
