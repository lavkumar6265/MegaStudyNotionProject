const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
require("dotenv").config();

//sendOTP

exports.sendOTP = async (req, res) => {
  try {
    //fetch email from request ki body
    const { email } = req.body;

    //check if user already exist, then return a response
    const checkUserPresent = await User.findOne({ email });

    //if user already exist , then return a response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    //generate otp
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generator : ", otp);

    //check unique otp or not
    let result = await OTP.findOne({ otp: otp });

    //no need to this code we can use any pre build libary for unic otp🙂🙂🙂
    //without any need dont db call again and again
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    //create an entry for otp
    const otpBody = await OTP.create(otpGenerator);
    console.log(otpBody);

    //return response successful
    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//signUp
exports.signUp = async (req, res) => {
  try {
    //data fetch from request ki body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //validate karlo

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //2 password match karlo

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and ConfirmPassword Value does not match, pleace try again",
      });
    }

    //check user already exits or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    //find most recent OTP stored for the user
    const recentOtp = (await OTP.find({ email }))
      .toSorted({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);

    //validated OTP
    if (recentOtp.length == 0) {
      //OTP
      return res.status(400).json({
        success: false,
        message: "OTP Found",
      });
    } else if (otp !== recentOtp.otp) {
      //Invalid OTP
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    //entry create in DB
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({
      success: true,
      message: "User is registered Successfully",
    });
  } catch (error) {
    console.log(error);
   return res.status(500).json({
        success:false,
        message:"User cannot be registered. Please try again"
    })
  }
};

//this is love who are you and what are you doing here 