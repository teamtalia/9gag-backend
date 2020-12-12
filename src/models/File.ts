import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import User from './User';
import Tag from './Tag';
import Post from './Post';

@Entity('files')
class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  key: string;

  @Column()
  location: string;

  @Column()
  mimetype: string;

  @Column()
  contentType: string;

  @Column()
  originalname: string;

  @Column()
  size: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.files)
  user: User;

  @OneToMany(() => Tag, tag => tag.icon)
  tags: Tag[];

  @OneToMany(() => Post, post => post.file)
  posts: Post[];
}

export default File;
