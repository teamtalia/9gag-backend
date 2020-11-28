declare namespace Express {
  export interface Request {
    token: any;
  }
}

declare namespace Mail {
  export interface SendMailOptions {
    template: string;
  }
}
