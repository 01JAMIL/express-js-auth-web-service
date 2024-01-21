import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

async function createDatabaseIfNotExists() {
  const connectionSequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  });

  try {
    await connectionSequelize.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE_NAME}`
    );
    console.log(
      `\x1b[34m[server]: Database ${process.env.DATABASE_NAME} created\x1b[0m`
    );

    await sequelize
      .sync()
      .then(() => {
        console.log("\x1b[34m[server]: Database connected\x1b[0m");
      })
      .catch((err) => {
        console.log("\x1b[31m[server]: Database connection error\x1b[0m");
        console.log(err);
      });
  } catch (err) {
    console.log("\x1b[31m[server]: Database creation error\x1b[0m");
    console.log(err);
  }
}

createDatabaseIfNotExists();