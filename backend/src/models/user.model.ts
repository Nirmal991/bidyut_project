import mongoose, { Model, HydratedDocument } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { SignOptions, Secret } from "jsonwebtoken";

export interface IUser {
    username: string;
    email: string;
    password: string;
    profileImage?: string;
    refreshToken?: String | undefined;
}

export interface IUserMethods {
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}

export type IUserDocument = HydratedDocument<IUser> & IUserMethods;

const userSchema = new mongoose.Schema<IUserDocument, IUserMethods, Model<IUserDocument>>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        profileImage: {
            type: String
        },
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre<IUserDocument>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  const accessTokenSecret: Secret = process.env.ACCESS_TOKEN_SECRET as Secret;

  const options: SignOptions = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"],
  };

  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    accessTokenSecret,
    options
  );
};

userSchema.methods.generateRefreshToken = function () {
  const refreshTokenSecret: Secret = process.env.REFRESH_TOKEN_SECRET as Secret;
  const options: SignOptions = {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"],
  };

  return jwt.sign(
    {
      _id: this.id,
    },
    refreshTokenSecret,
    options
  );
};

export const User = mongoose.model<IUserDocument>("User", userSchema);