export type User = {
  id: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
};

export type AuthUser = {
  id: string;
  email: string;
  role: 'admin' | 'user';
};