import { IUserDocument } from "../models";

declare global {
  namespace Express {
    interface Request {
      username?: IUserDocument;
    }
  }
}

export {};