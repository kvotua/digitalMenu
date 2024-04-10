export interface IUser {
  id: string;
  likes: {
    products: string[];
    compositions: string[];
  };
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
}
