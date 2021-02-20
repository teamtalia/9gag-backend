import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import File from './File';

@Entity('file_resources')
class FileResource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tag: string;

  @ManyToOne(() => File, file => file.sources)
  file: File;
}

export default FileResource;
