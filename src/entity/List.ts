import {
  ManyToOne,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Todo } from "./Todo";

@Entity({ name: "lists" })
export class List extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  user: User;

  @Column()
  title: string;

  @Column()
  isComplete: boolean;

  @OneToMany(() => Todo, (todo) => todo.list)
  todo: Todo;
}
