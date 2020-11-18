import { Router } from 'express';
import User from '../models/user.model';

const router = Router();

router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.route('/add').post((req, res) => {
  const { username } = req.body;
  const { email } = req.body;
  const age = Number(req.body.age);
  const { password } = req.body;
  const newUser = new User({ username, email, age, password });

  newUser
    .save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

export default router;
