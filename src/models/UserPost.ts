import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

import User from './User';
import Post from './Post';

@Entity('userPost')
class UserPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({ name: 'userId' })
  user: User;

  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column()
  voted: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}

export default UserPost;
