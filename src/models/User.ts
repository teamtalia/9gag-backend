import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import PasswordReset from './PasswordReset';
import File from './File';
import Post from './Post';
import Comment from './Comment';
import UserComment from './UserComment';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullname: string;

  @Column({ nullable: true })
  age: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true, name: 'verification_code' })
  verificationCode: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true, unique: true })
  username: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'verified_at' })
  verifiedAt: Date;

  @OneToMany(() => PasswordReset, passwordReset => passwordReset.user)
  passwordResets: PasswordReset[];

  @OneToMany(() => File, file => file.user)
  files: File[];

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];

  @OneToMany(() => UserComment, userComment => userComment.user)
  metaComments: UserComment[];

  @ManyToOne(() => File, file => file.avatar)
  @JoinColumn({ name: 'avatar', referencedColumnName: 'id' })
  avatar: File;
}

export default User;
