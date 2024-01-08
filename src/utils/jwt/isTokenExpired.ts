import jwt from "jsonwebtoken";
import { ExtractTokenPayload } from "./jwtPayloads";

export const isTokenExpired = (token: string): boolean => {
  const { exp }: ExtractTokenPayload = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as ExtractTokenPayload;

  // Date.now() >= exp * 1000 => False

  return Date.now() >= exp * 1000;
};
