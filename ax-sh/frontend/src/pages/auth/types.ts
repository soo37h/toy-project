export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  nickname: string;
}

export interface User {
  member_id: number;
  email: string;
  nickname: string;
  role: string;
}
