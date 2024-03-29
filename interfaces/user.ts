export interface IUser {
  id: number | string;
  username: string;
  fullname: string;
  avatar: string;
  role: string;
  accessToken: string;
}

export interface IAuth {
  refreshToken: boolean | null;
  userData: IUser;
}

export interface IToken {
  id: number;
  iat: number;
  exp: number;
}

export interface ILoginForm {
  username: string;
  password: string;
}
