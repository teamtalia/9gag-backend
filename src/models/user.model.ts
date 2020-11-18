import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    // alterar id para gerar depois
  },
  {
    timestamps: true,
  },
);

const User = model('User', userSchema);

export default User;
