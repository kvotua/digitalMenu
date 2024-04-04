export interface IUser {
  id: string;
  likes: {
    products: string[];
    compositions: string[];
  };
  username: string;
}
