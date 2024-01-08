import validator from "validator";
import { isEmpty } from "./isEmpty";

interface UserFormValidationError {
  firstNameError?: string;
  lastNameError?: string;
  emailError?: string;
  passwordError?: string;
}

type UserFormValidationReturnType = {
  errors: UserFormValidationError;
  isValid: boolean;
};

export const validateCreateUserAccount = (
  data: any
): UserFormValidationReturnType => {
  let errors: UserFormValidationError = {};

  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (validator.isEmpty(data.firstName)) {
    errors.firstNameError = "First name is required";
  }

  if (validator.isEmpty(data.lastName)) {
    errors.lastNameError = "Last name is required";
  }

  if (validator.isEmpty(data.email)) {
    errors.emailError = "Email is required";
  } else if (!validator.isEmail(data.email)) {
    errors.emailError = "Email format is invalid";
  }

  if (validator.isEmpty(data.password)) {
    errors.passwordError = "Password is required";
  } else if (!validator.isLength(data.password, { min: 8, max: 16 })) {
    errors.passwordError = "Password must be between 8 and 16 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export const validateAuthenticateUser = (
  data: any
): UserFormValidationReturnType => {
  let errors: UserFormValidationError = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (validator.isEmpty(data.email)) {
    errors.emailError = "Email is required";
  } else if (!validator.isEmail(data.email)) {
    errors.emailError = "Email format is invalid";
  }

  if (validator.isEmpty(data.password)) {
    errors.passwordError = "Password is required";
  } else if (!validator.isLength(data.password, { min: 8, max: 16 })) {
    errors.passwordError = "Password must be between 8 and 16 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
