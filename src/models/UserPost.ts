import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import User from './User';
import Post from './Post';

@Entity('user_posts')
class UserPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, user => user.votePosts)
  user: User;

  // @JoinColumn({ name: 'postId' })
  @ManyToOne(() => Post, post => post.votes)
  post: Post;

  @Column()
  voted: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default UserPost;
