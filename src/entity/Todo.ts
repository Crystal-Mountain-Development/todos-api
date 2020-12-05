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

  @ManyToOne(() => List, (list) => list.id, { nullable: false })
  list: List;

  @Column()
  summary: string;

  @Column()
  isComplete: boolean;
}
