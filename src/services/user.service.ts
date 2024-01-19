import argon from "argon2";
import { User, UserInput } from "../models/user.model";
import { userMapper } from "../utils/mappers/user.mapper";
import { UserModel } from "../models/user.model";
import { SessionModel } from "../models/session.model";

export const createUser = async (
  data: UserInput
): Promise<User | undefined> => {
  const hashedPassword = await argon.hash(data.password);
  try {
    const result = await UserModel.create({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: hashedPassword,
    });
    const createdUser: User = userMapper(result.dataValues);
    return createdUser;
  } catch (error) {
    console.error("Error creating user:", error);
  }
  return undefined;
};

export const getUserByCredentials = async (
  email: string,
  password: string
): Promise<User | undefined> => {
  try {
    const result = await UserModel.findOne({
      where: {
        email,
      },
    });
    if (result && Object.keys(result.dataValues).length > 0) {
      const userData: User = userMapper(result.dataValues);
      const isPasswordValid = await argon.verify(userData.password, password);
      if (isPasswordValid) {
        return userData;
      }
    }
  } catch (error) {
    console.error("Error getting user data: ", error);
  }
  return undefined;
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  try {
    const result = await UserModel.findOne({
      where: {
        id,
      },
    });

    if (result && Object.keys(result.dataValues).length > 0) {
      const userData: User = userMapper(result.dataValues);
      return userData;
    }
  } catch (error) {
    console.error("Error getting user data: ", error);
  }
  return undefined;
};

export const saveAccessTokenToSession = async (
  refreshToken: string
): Promise<string | undefined> => {
  try {
    const result = await SessionModel.create({
      refresh_token: refreshToken,
    });
    return result.dataValues.refresh_token;
  } catch (error) {
    console.error("Error saving refresh token: ", error);
  }
  return undefined;
};

export const isValidRefreshToken = async (
  refreshToken: string
): Promise<boolean> => {
  try {
    const result = await SessionModel.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (result && Object.keys(result.dataValues).length > 0) {
      return true;
    }
  } catch (error) {
    console.error("Error getting refresh token: ", error);
  }
  return false;
};
