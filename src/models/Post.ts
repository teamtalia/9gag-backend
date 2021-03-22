import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import User from './User';
import File from './File';
import Tag from './Tag';
import Comment from './Comment';
import UserPost from './UserPost';

@Entity('posts')
class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalPoster: string;

  @Column()
  sensitive: boolean;

  @Column()
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.posts)
  user: User;

  @ManyToOne(() => File, file => file.posts)
  file: File;

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];

  @ManyToMany(() => UserPost)
  @JoinTable({
    name: 'post_votes',
    joinColumn: { name: 'postId' },
    inverseJoinColumn: { name: 'voted' },
  })
  votes: UserPost[];

  @ManyToMany(() => Tag)
  @JoinTable({
    name: 'posts_tags',
    joinColumn: { name: 'postId' },
    inverseJoinColumn: { name: 'tagId' },
  })
  tags: Tag[];
}

export default Post;
