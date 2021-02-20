import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import User from './User';
import Tag from './Tag';
import Post from './Post';
import FileResource from './FileResource';

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

  @OneToMany(() => FileResource, source => source.file)
  sources: FileResource[];

  @OneToMany(() => User, user => user.avatar)
  @JoinColumn({ name: 'id', referencedColumnName: 'avatar' })
  avatar: User[];
}

export default File;
