import {
  ManyToOne,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
} from "typeorm";
import { List } from "./List";

@Entity({ name: "todos" })
export class Todo extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  summary: string;

  @Column()
  isComplete: boolean;

  @Column()
  listId: number;

  @ManyToOne(() => List, (list) => list.id, { nullable: false })
  list: List;
}
