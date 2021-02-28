import { Request, Response, NextFunction } from 'express';

const beforeUpload = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.headers, req.body);
  throw Error('fodace');
  // return next();
};

export default beforeUpload;
