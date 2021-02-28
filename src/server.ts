import express from 'express';
import 'reflect-metadata';
import './database';
import cors from 'cors';
import dotenv from 'dotenv';

import postsRouter from './routes/posts.routes';
import usersRouter from './routes/users.routes';
import sessionRouter from './routes/session.routes';
import filesRouter from './routes/files.routes';
import tagsRouter from './routes/tags.routes';

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`O servidor está rodando na porta: ${port} 🚀`);
});

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'welcome to talia api, check the documentation.' });
});

// need rewrite
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/session', sessionRouter);
app.use('/files', filesRouter);
app.use('/tags', tagsRouter);

export default app;
