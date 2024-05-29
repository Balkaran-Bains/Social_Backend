import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponce.js";
import {uploadonCloudinary} from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import {User} from "../models/user.model.js";
import { Mongoose } from "mongoose";

// import jwt from "jsonwebtoken"
// import mongoose from "mongoose";


// generating Access and Refresh tokens
const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        
        const user = await User.findById(userId)     
        if (!user) {
            throw new ApiError(404, "User not found");
          }
       
        const accessToken = user.generateAccessToken(); 
        const refreshToken = user.generateRefreshToken(); 

        user.accessToken = accessToken;
        user.refreshToken = refreshToken;

    // Save the user with the updated tokens (avoiding unnecessary validation)
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating access and refresh tokens", error);
  }
};


// Register User
const registerUser = asyncHandler( async (req,res)=>{

    
    const {fullname, email, username, password}= req.body 
    console.log ("email", email);

    if([fullname, email, username,password].some((field)=>field?.trim()==="")){ 
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({ 
        $or: [{username} , {email}]           
    })

    if (existedUser) {
        throw new ApiError(409, "user already exist")
    }

    const avatalLocalPath = req.files?.avatar[0]?.path; 
  

    if (!avatalLocalPath) {
         throw new ApiError(400, "Avatar is required")
    }

 const avatar =  await uploadonCloudinary(avatalLocalPath)          


 if (!avatar) {
    throw new ApiError(400, "Not able to uplaod avatar, try again!")
 }

const user = await User.create({       
    fullname,
    avatar : avatar.url,
    email,
    password,
    username : username.toLowerCase()
 }) 

 const createdUser = await User.findById(user._id).select(    
    "-password -refreshToken" 
 )

 if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
    
 }

 
 return res.status(201).json(
    new ApiResponse(200, createdUser, "user registered Successfully")
 )

})

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username and Email are required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist, SignUp first.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  //const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  // Set tokens as cookies
  const options = {
    httpOnly: true,
    secure: true, // Set to true if you're using HTTPS
     sameSite: 'None', // Adjust based on your needs
    // maxAge: 24 * 60 * 60 * 1000 // 1 day for access token
  };
  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
      new ApiResponse(
          200,
          {
              user:  accessToken, refreshToken, username : user.username
          },
          "User logged in successfully !!!."
      )
  );

});
  

// LogOut User
const logoutUser= asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate( req.user._id,          
       {
           $unset:{
               refreshToken : 1
           }
       },
       {
           new: true 
       }
    )

    
    const options={ 
       httpOnly: true,
       secure: true
    };

    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);
    res.status(200).json(new ApiResponse(200, {}, "User logged Out"));
});


const getUserProfile = asyncHandler(async (req, res) => {
  try {
      const user = await User.findById(req.user._id).select('-password -refreshToken'); // Exclude password and refreshToken fields
      if (!user) {
          throw new ApiError(404, "User not found");
      }
      res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
  } catch (error) {
      throw new ApiError(500, "Server Error", error);
  }
});

// New controller method to get user by username
const getUserByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username }).select('-password -refreshToken');

  if (!user) {
      throw new ApiError(404, "User not found");
  }

  const posts = await Post.find({ user: user._id }); // Assuming you have a Post model and posts reference user by user._id

  res.status(200).json(new ApiResponse(200, { user, posts }, "User profile fetched successfully"));
});


export {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    getUserByUsername
}