import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'verified_at' })
  verifiedAt: Date;
}

export default User;
