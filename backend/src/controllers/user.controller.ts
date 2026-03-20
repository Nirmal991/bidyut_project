import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../lib/cloudinary";
import { ApiError } from "../lib/ApiError";
import { User } from "../models";
import { ApiResponse } from "../lib/ApiResponse";

export const registerUser = async (req: Request, res: Response) => {
  console.log("REGISTER HIT");
  try {
    let profileImageLocalPath;
    let profileImageUrl;
    if (req.file?.path) {
      profileImageLocalPath = req.file.path;
      const cloudinaryResult = await uploadToCloudinary(profileImageLocalPath);
      if (cloudinaryResult?.url) {
        profileImageUrl = cloudinaryResult.url;
      }
    }
    const { username, email, password } = req.body;

    if (!username || username === "") {
      throw new ApiError(400, "username is required");
    }

    if (!email || email === "") {
      throw new ApiError(400, "email is required");
    }

    if (!email.includes("@")) {
      throw new ApiError(400, "invalid email");
    }

    if (!password || password === "") {
      throw new ApiError(400, "passowrd is required");
    }

    let existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ApiError(
        409,
        "User with this email or username already exists."
      );
    }

    let user;
    if (profileImageUrl) {
      user = await User.create({
        username,
        email,
        password,
        profileImage: profileImageUrl,
      });
    } else {
      user = await User.create({
        username,
        email,
        password,
      });
    }

    const createdUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while creating the user");
    }

    // await sendMail(
    //   email,
    //   "Thank you for joining our community",
    //   `<h2>Welcome, ${username} to "ConnectHub"</h2>
    //   <p>Share your favorite photos 📸, 
    //   ❤️ Like and comment on posts, 
    //   👥 Connect with friends and discover new people </p>`
    // )

    const accessToken = createdUser.generateAccessToken();
    const refreshToken = createdUser.generateRefreshToken();

    createdUser.refreshToken = refreshToken;
    await createdUser.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(createdUser._id).select(
      "-password -refreshToken"
    );

    const cookiesOptions = {
      httpOnly: true,
    };

    return res
      .status(201)
      .cookie("accessToken", accessToken, cookiesOptions)
      .cookie("refreshToken", refreshToken, cookiesOptions)
      .json(
        new ApiResponse(
          201,
          {
            success: true,
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User registered successfully"
        )
      );
  } catch (error: unknown) {
    console.error("Error: ", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: [],
    });
  }
};