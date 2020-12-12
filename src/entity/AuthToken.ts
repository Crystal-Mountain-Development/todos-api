import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity({ name: "authtokens" })
export class AuthToken extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  val: string;

  @Column({ type: "timestamp" })
  expDate: Date;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  user: User;
}
