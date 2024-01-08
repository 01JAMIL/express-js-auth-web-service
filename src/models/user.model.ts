export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export interface UserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserAuthenticationInput {
  email: string;
  password: string;
}
