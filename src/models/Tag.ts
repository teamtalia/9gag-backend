import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import File from './File';
import Category from './Category';
import Post from './Post';

@Entity('tags')
class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  slug: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => File, file => file.tags)
  @JoinColumn({ name: 'icon' })
  icon: File;

  @ManyToOne(() => Category, category => category.tags)
  category: Category;

  @ManyToMany(() => Post)
  @JoinTable({
    name: 'posts_tags',
    joinColumn: { name: 'tagId' },
    inverseJoinColumn: { name: 'postId' },
  })
  posts: Post[];
}

export default Tag;
