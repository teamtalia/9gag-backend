import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import User from './User';
import Comment from './Comment';

@Entity('users_comments')
class UserComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vote: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.metaComments)
  user: User;

  @ManyToOne(() => Comment, comment => comment.meta)
  comment: Comment;
}

export default UserComment;
