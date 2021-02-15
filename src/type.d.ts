declare namespace Express {
  export interface Request {
    token: {
      user: {
        id: string;
        fullname: string;
        email: string;
      };
    };
  }
}
