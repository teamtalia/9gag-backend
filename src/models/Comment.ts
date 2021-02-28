import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import User from './User';
import Post from './Post';
import File from './File';
import UserComment from './UserComment';

@Entity('comments')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column()
  edited: boolean;

  @Column()
  level: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.comments)
  user: User;

  @ManyToOne(() => Post, post => post.comments)
  post: Post;

  @ManyToOne(() => File, file => file.comments)
  file: File;

  @ManyToOne(() => Comment, comment => comment.replies)
  reply: Comment;

  @OneToMany(() => Comment, comment => comment.reply)
  replies: Comment[];

  @OneToMany(() => UserComment, userComment => userComment.comment)
  meta: UserComment[];
}

export default Comment;
