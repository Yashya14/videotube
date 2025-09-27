import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * 
 * @param {*} userId 
 * for particular user
 * generate both access & refesh token
 */
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refeshToken = user.generateRefreshToken();

    user.refeshToken = refeshToken;
    await user.save({ validateBeforeSave: false })  // mongoose model kikan without validateBefreSave - no validation

    return { accessToken, refeshToken };

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refesh token");
  }
}

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  const { username, fullname, email, password } = req.body;

  // validation - not empty fields
  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user already exists : username, email
  const existingUser = await User.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // check for images, check for avatar (coverImge is optional)
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  let coverImageLocalPath;

  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // upload images to cloudinary,avatar is mandatory
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // create user object - create entry in db
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // remove password & refresh token  feilds from the response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while createing user");
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // login with email or username
  // find the user by rmail or username
  // check password
  // acceess and refresh token
  // send cookie

  const { email, username, password } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refeshToken } = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = User.findById(user._id).select("-password -refeshToken");  // exclude password & refesh token

  // for cookies - it will only modified by server
  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refeshToken", refeshToken, options)
    .json(new ApiResponse(200, {
      user: loggedInUser, accessToken, refeshToken
    },
      "User logged In Successfully"
    ))

});

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await User.findByIdAndUpdate(userId, {
    $set: {
      refeshToken: undefined
    }
  },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refeshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out Successfully"))
})

export { registerUser, loginUser, logoutUser };
