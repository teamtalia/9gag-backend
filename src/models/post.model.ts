import { Schema, model } from 'mongoose';

const postSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    title: { type: String, required: true },
    category: { type: String, required: true },
    url: { type: String, required: true },
    date: { type: String, required: true },
    // usar api para data também
    // #request-change::init
    points: { type: Number, required: true },
    upvote: { type: Number, required: true },
    downvote: { type: Number, required: true },
    // #request-change::end
  },
  {
    timestamps: true,
  },
);

const Post = model('Post', postSchema);

export default Post;
