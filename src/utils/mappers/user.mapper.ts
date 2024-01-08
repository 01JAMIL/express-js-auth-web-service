import { User } from "../../models/user.model";

export const userMapper = (row: any): User => {
  const { id, first_name, last_name, email, password, created_at, updated_at } =
    row;

  const result: User = {
    id,
    firstName: first_name,
    lastName: last_name,
    email,
    password,
    created_at,
    updated_at,
  };

  return result;
};
