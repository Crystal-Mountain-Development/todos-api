import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { AuthToken } from "./AuthToken";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 50 })
  username: string;

  @Column({ length: 50 })
  email: string;

  @OneToMany(() => AuthToken, (authToken) => authToken.user)
  authTokens: AuthToken[];
}
