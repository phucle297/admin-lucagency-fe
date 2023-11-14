export interface IUser {
  _id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
  password?: string;
  key?: string;
}
