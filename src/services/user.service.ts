import argon from "argon2";
import { pool } from "../config/database.config";
import { User, UserInput } from "../models/user.model";
import { userMapper } from "../utils/mappers/user.mapper";

export const createUser = async (
  data: UserInput
): Promise<User | undefined> => {
  const hashedPassword = await argon.hash(data.password);
  const [rows]: any = await pool.query(`INSERT INTO user SET ?`, {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    password: hashedPassword,
  });

  if (rows.affectedRows > 0) {
    const user: User | undefined = await getUserById(rows.insertId);
    return user;
  }

  return undefined;
};

export const getUserByCredentials = async (
  email: string,
  password: string
): Promise<User | undefined> => {
  const [rows]: any = await pool.query(
    `SELECT * FROM user WHERE email = '${email}'`
  );

  if (rows.length > 0) {
    const userData: User = userMapper(rows[0]);
    const isPasswordValid = await argon.verify(userData.password, password);

    if (isPasswordValid) {
      return userMapper(rows[0]);
    }
  }

  return undefined;
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  const [rows]: any = await pool.query(`SELECT * FROM user WHERE id = ${id}`);

  if (rows.length > 0) {
    return userMapper(rows[0]);
  }

  return undefined;
};

export const saveAccessTokenToSession = async (
  refreshToken: string
): Promise<string | undefined> => {
  const [rows]: any = await pool.query(`INSERT INTO session SET ?`, {
    refresh_token: refreshToken,
  });

  if (rows.affectedRows > 0) {
    return refreshToken;
  }

  return undefined;
};

export const isValidRefreshToken = async (
  refreshToken: string
): Promise<boolean> => {
  const [rows]: any = await pool.query(
    `SELECT * FROM session WHERE refresh_token = '${refreshToken}'`
  );

  if (rows.length > 0) {
    return true;
  }

  return false;
};
