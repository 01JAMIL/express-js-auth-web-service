import jwt from "jsonwebtoken";
import { CreateTokenPayload } from "./jwtPayloads";

export const generateAccessToken = (payload: CreateTokenPayload) => {
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1m",
    }
  );
};

export const generateRefreshToken = (payload: CreateTokenPayload) => {
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
};
