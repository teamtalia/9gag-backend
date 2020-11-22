import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postsRouter from './routes/posts';
import usersRouter from './routes/users';
import imagekitRouter from './routes/imagekit';

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI || '';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
});
const { connection } = mongoose;
connection.once('open', () => {
  // console.log('MongoDB base de dados conectada com sucesso.');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
app.get('/', (req, res) => {
  res.status(200);
});
app.use('/imagekit', imagekitRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

export default app;
