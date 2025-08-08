import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DateUtils } from 'typeorm/util/DateUtils.js';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column()
  password: string;

  // Additional fields can be added as needed
  @Column({ default: DateUtils.mixedDateToDate(new Date()) })
  createdAt: Date;

  @Column({ default: DateUtils.mixedDateToDate(new Date()) })
  updatedAt: Date;
}
