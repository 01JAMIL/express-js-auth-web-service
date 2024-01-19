import { User } from "../../models/user.model";

export const userMapper = (row: any): User => {
  const { id, first_name, last_name, email, password, createdAt, updatedAt } =
    row;

  const result: User = {
    id,
    firstName: first_name,
    lastName: last_name,
    email,
    password,
    createdAt,
    updatedAt,
  };

  return result;
};
