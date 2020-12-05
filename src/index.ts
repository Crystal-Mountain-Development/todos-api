import dayjs from "dayjs";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { AuthToken } from "./entity/AuthToken";
import { User } from "./entity/User";

createConnection()
  .then(async () => {
    console.log("Inserting a new user into the database...");

    const user = new User();
    user.email = "user@example.com";
    user.username = "user";
    await user.save();

    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await User.find();
    console.log("Loaded users: ", users);

    const authToken = new AuthToken();
    authToken.user = user;
    authToken.val = "4865";
    authToken.expDate = dayjs().add(30, "minute").toDate();

    await authToken.save();
    console.log(
      "New Authentication Token: " +
        authToken.val +
        ": " +
        authToken.expDate +
        ": " +
        authToken.id
    );

    const tokens = await AuthToken.find({ relations: ["user"] });
    console.log("Tokens: ", tokens);

    console.log("Here you can setup and run express/koa/any other framework.");
  })
  .catch((error) => console.log(error));
