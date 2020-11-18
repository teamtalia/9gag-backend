import { Router } from 'express';
import Post from '../models/post.model';

const router = Router();

router.route('/').get((req, res) => {
  Post.find()
    .then(post => res.json(post))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.route('/add').post((req, res) => {
  const { username } = req.body;
  const { title } = req.body;
  const { category } = req.body;
  const { url } = req.body;
  const date = Date.parse(req.body.date);
  const points = Number(req.body.points);
  const upvote = Number(req.body.upvote);
  const downvote = Number(req.body.downvote);

  const newPost = new Post({
    username,
    title,
    category,
    url,
    date,
    points,
    upvote,
    downvote,
  });

  newPost
    .save()
    .then(() => res.json('Post added!'))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

export default router;
