export type AuthFormState = {
  status?: string;
  errors?: {
    email?: string[];
    password?: string[];
    name?: string[];
    role?: string[];
    _form?: string[];
  };
};
