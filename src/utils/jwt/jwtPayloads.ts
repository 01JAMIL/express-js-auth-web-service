export interface ExtractTokenPayload {
  id: number;
  email: string;
  iat: number;
  exp: number;
}

export interface CreateTokenPayload {
  id: number;
  email: string;
}
