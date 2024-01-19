import express, { Express } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
/* 
  Calling the dotenv.config() at the very beginning of the application 
  to ensure that the env variables loaded correctly 
*/
dotenv.config();

import userRouter from "./routes/user.route";
import { sequelize } from "./config/database.config";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.use("/api/user", userRouter);

sequelize
  .sync()
  .then(() => {
    console.log("\x1b[34m[server]: Database connected\x1b[0m");
  })
  .catch((err) => {
    console.log("\x1b[31m[server]: Database connection error\x1b[0m");
    console.log(err);
  });

app.listen(port, () => {
  console.log(
    `\x1b[34m[server]: server is running at http://localhost:${port}\x1b[0m`
  );
});
