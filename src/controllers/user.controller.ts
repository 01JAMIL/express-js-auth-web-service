import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { User, UserAuthenticationInput, UserInput } from "../models/user.model";

import {
  getUserById,
  createUser,
  getUserByCredentials,
  saveAccessTokenToSession,
  isValidRefreshToken,
} from "../services/user.service";

import {
  validateAuthenticateUser,
  validateCreateUserAccount,
} from "../utils/validation/user.validation";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt/generateTokens";
import { ExtractTokenPayload } from "../utils/jwt/jwtPayloads";
import { isTokenExpired } from "../utils/jwt/isTokenExpired";

export const signUp = async (req: Request, res: Response) => {
  const { errors, isValid } = validateCreateUserAccount(req.body);

  if (!isValid) {
    return res.status(400).json({
      status: "ERROR",
      message: "Invalid request data",
      errors,
    });
  }

  try {
    const data: UserInput = req.body;
    const user: User | undefined = await createUser(data);

    if (!user) {
      return res.status(404).json({
        status: "ERROR",
        message: "User could not be created",
      });
    }

    return res.status(200).json({
      status: "OK",
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: "Internal server error",
    });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { errors, isValid } = validateAuthenticateUser(req.body);

  if (!isValid) {
    return res.status(400).json({
      status: "ERROR",
      message: "Invalid request data",
      errors,
    });
  }

  try {
    const data: UserAuthenticationInput = req.body;

    const user: User | undefined = await getUserByCredentials(
      data.email,
      data.password
    );

    if (!user) {
      return res.status(404).json({
        status: "ERROR",
        message: "Bad credentials",
      });
    }

    const accessToken: string = generateAccessToken({
      id: user.id,
      email: user.email,
    });

    const refreshToken: string = generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    const savedRefreshToken: string | undefined =
      await saveAccessTokenToSession(refreshToken);

    if (!savedRefreshToken) {
      return res.status(500).json({
        status: "ERROR",
        message: "Internal server error",
      });
    }

    return res.status(200).json({
      status: "OK",
      message: "User logged in successfully",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      message: "Internal server error",
    });
  }
};

export const getUserDataById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: "ERROR",
      message: "Invalid request data",
    });
  }

  if (req.body.userId !== parseInt(id)) {
    return res.status(401).json({
      status: "ERROR",
      message: "You are not authorized to access this route",
    });
  }

  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({
        status: "ERROR",
        message: "This user does not exist",
      });
    }

    return res.status(200).json({
      status: "OK",
      message: "User data retrieved successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      message: "Internal server error",
    });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken || !isValidRefreshToken(refreshToken)) {
      return res.status(500).json({
        status: "ERROR",
        message: "Invalid refresh token",
      });
    }

    if (isTokenExpired(refreshToken)) {
      return res.status(401).json({
        status: "ERROR",
        message: "The refresh token has expired",
      });
    }

    const decodedToken: ExtractTokenPayload = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET as string
    ) as ExtractTokenPayload;

    const accessToken: string = generateAccessToken({
      id: decodedToken.id,
      email: decodedToken.email,
    });

    return res.status(200).json({
      status: "OK",
      message: "Access token refreshed successfully",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      message: "Internal server error",
    });
  }
};
