const User = require("../models/user");
const { messageBird } = require('../config');

const {
  USER_NOT_FOUND_ERR,
  INCORRECT_OTP_ERR,
  USER_NOT_PROVIDED,
  OTP_NOT_PROVIDED
} = require("../error");

const { createJwtToken } = require("../utils/token");

const { generateOTP } = require("../utils/otp");
const { default: mongoose } = require("mongoose");

// --------------------- create new user ---------------------------------

exports.createOrloginUser = async (req, res, next) => {
  try {
    let { phoneNumber } = req.body;

    // check duplicate phone Number
    let user = await User.findOne({ phoneNumber: phoneNumber }).exec();
    
    if (!user) {
      const createUser = new User({
        phoneNumber: phoneNumber,
      });
      user = await createUser.save();
    } 

    res.status(200).json({
      type: "success",
      message: "OTP sended to mobile number",
      data: {
        userId: user._id,
      },
    });

    const otp = generateOTP(4);
    console.log(otp);
    // save otp to user collection
    await User.updateOne({ _id: user._id }, { otp }).exec();

    /* messageBird.messages.create({ originator: "Umesh", body: 'Your Login OTP is ' + otp, recipients: [user.phoneNumber]}, (err, res) => {
      if (err) console.log("Somthing went wrong!", err);
    }); */

   
  } catch (error) {
    next(error);
  }
};

exports.resendOtp = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      next({status: 400, message: USER_NOT_PROVIDED });
      return;
    }

    const user = await User.findById(new mongoose.Types.ObjectId(userId)).exec();
    if (!user?._id) {
      next({ status: 400, message: USER_NOT_FOUND_ERR });
      return;
    }
    const otp = generateOTP(4);
    console.log(otp);
    // save otp to user collection
    await User.updateOne({ _id: user._id }, { otp }).exec();

    res.status(200).json({
      type: "success",
      message: "OTP sended to mobile number",
      data: {
        userId: user._id,
      },
    });

    /* messageBird.messages.create({ originator: "Umesh", body: 'Your Login OTP is ' + otp, recipients: [user.phoneNumber]}, (err, res) => {
      if (err) console.log("Somthing went wrong!", err);
    }); */
    
  } catch (error) {
    next(error);
  }
}

exports.verifyPhoneOtp = async (req, res, next) => {
  try {

    const { otp, userId } = req.body;
    if (!otp) {
      next( {status: 400, message: OTP_NOT_PROVIDED } );
      return; 
    }
    if (!userId) {
      next({status: 400, message: USER_NOT_PROVIDED });
      return;
    }

    const user = await User.findById(userId).exec();

    if (!user) {
      next({ status: 400, message: USER_NOT_FOUND_ERR });
      return;
    }

    if (user.otp !== otp) {
      next({ status: 400, message: INCORRECT_OTP_ERR });
      return;
    }

    const token = createJwtToken({ userId: user._id, profileSetupCompleted: user.profileSetupCompleted });

    user.otp = "";
    await user.save();

    res.status(201).json({
      type: "success",
      message: "OTP verified successfully",
      data: {
        token,
        userId: user._id,
        profileSetupCompleted: user.profileSetupCompleted,
      },
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.checkAuth = async (req, res, next) => {
  try {

    res.status(201).json({
      type: "success",
      message: "OTP verified successfully",
      data: {
        userId: req.user._id,
      },
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
}
