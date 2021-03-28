import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeRemove,
} from 'typeorm';
import User from './User';
import Tag from './Tag';
import Post from './Post';
import Comment from './Comment';
import FileResource from './FileResource';
import { S3, AwsBucket } from '../config/s3';
import ServiceError from '../util/ServiceError';

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

  @OneToMany(() => Comment, comment => comment.file)
  comments: Comment[];

  @OneToMany(() => FileResource, source => source.file)
  sources: FileResource[];

  @OneToMany(() => User, user => user.avatar)
  @JoinColumn({ name: 'id', referencedColumnName: 'avatar' })
  avatar: User[];

  @BeforeRemove()
  async updateAWS(): Promise<void> {
    try {
      await S3.deleteObject({
        Bucket: AwsBucket,
        Key: this.key,
      }).promise();
    } catch (err) {
      throw new ServiceError(
        `erro ao mover o arquivo no intervalo amazon: ${err}`,
      );
    }
  }
}

export default File;
