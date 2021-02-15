import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import User from './User';

@Entity('password_resets')
class PasswordReset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, name: 'code' })
  code: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'expire_at' })
  expireAt: Date;

  @ManyToOne(() => User, user => user.passwordResets)
  user: User;
}

export default PasswordReset;
