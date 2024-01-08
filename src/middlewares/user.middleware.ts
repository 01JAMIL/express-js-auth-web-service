import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ExtractTokenPayload } from "../utils/jwt/jwtPayloads";

export const protectUserRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | null = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decodedToken: ExtractTokenPayload = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as ExtractTokenPayload;

      req.body.userId = decodedToken.id;
      req.body.userEmail = decodedToken.email;

      next();
    } catch (error) {
      return res.status(401).json({
        status: "ERROR",
        message: "The token is invalid or has expired",
      });
    }
  }

  if (!token)
    return res.status(401).json({
      status: "ERROR",
      message: "You are not authorized to access this route",
    });
};
