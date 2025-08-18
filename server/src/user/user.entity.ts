import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DateUtils } from 'typeorm/util/DateUtils.js';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50, unique: true, nullable: false })
  userName: string;

  @Column({ unique: true, length: 150, nullable: false })
  email: string;

  @Column()
  password: string;

  // Additional fields can be added as needed
  @Column({ default: DateUtils.mixedDateToDate(new Date()) })
  createdAt: Date;

  @Column({ default: DateUtils.mixedDateToDate(new Date()) })
  updatedAt: Date;
}
