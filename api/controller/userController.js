const AsyncHandler = require("express-async-handler");
const User = require("../model/User.js");
const Token = require("../helper/TokenHelper.js");
const sendMail = require("../utils/mail/EmailSend.js");
/**
 * @route "/api/v1/user/createuser"
 * @desc "This Controler id for creating user"
 * @Access { Private } admin only
 * @method "POST"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const createUser = AsyncHandler(async (req, res, next) => {
  const { firstName, lastName, phone, email, password, role } = req.body;

  // User Creation Script
  const userData = new User({
    firstName,
    lastName,
    phone,
    email,
    password,
    role,
  });
  const finalUserInfo = await userData.save();
  /**This veriable will exclude some valur and make a filter info */
  const userInfo = finalUserInfo._doc;
  res.status(201).json({
    message: "User Create Successfull",
    data: userInfo,
  });
  await sendMail({
    to: email,
    data: {
      phone: phone,
      email: email,
      password: password,
    },
  });
});
/**
 * @route "/api/v1/user/login"
 * @desc "This Controler id for Login user" this api will recive auth or password
 * @Access { Public }
 * @method "POST"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const loginUser = AsyncHandler(async (req, res, next) => {
  const { auth, password } = req.body;

  const user =
    (await User.findOne({ email: auth })) ||
    (await User.findOne({ phone: auth }));

  if (!user || !(await user.matchPassword(password))) {
    const error = new Error("User credential mismatch!");
    res.status(401);
    next(error);
    return;
  }

  // Genarate Json web token
  const token = Token.generate({
    fullName: user.fullName,
    _id: user._id,
    role: user.role,
  });

  // Send Data to Response
  // .cookie(USER_AUTH, token)
  res.status(200).json({
    message: "User login success",
    data: {
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      _id: user._id,
      role: user.role,
      email: user.email,
      phone: user.phone,
      extraPhone: user.extraPhone,
      extraEmail: user.extraEmail,
      isActive: user.isActive,
      accessories: user.accessories || [],
    },
    token,
  });
});

/**
 * @route "/api/v1/user/verify"
 * @desc "This controller will help to verify the token
 * @Access { Private }
 * @method "POST"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const verifyUser = AsyncHandler(async (req, res, next) => {
  let { _id } = req.tokenInfo;
  let user = await User.findById(_id);

  // Genarate Json web token
  const token = Token.generate({
    fullName: user?.fullName,
    firstName: user?.firstName,
    lastName: user?.lastName,
    _id: user._id,
    role: user.role,
  });

  // Send Data to Response
  res.status(200).json({
    message: "User login success",
    data: {
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      _id: user._id,
      role: user.role,
      email: user.email,
      phone: user.phone,
      extraPhone: user.extraPhone,
      extraEmail: user.extraEmail,
      isActive: user.isActive,
      accessories: user.accessories || [],
    },
    token,
  });
});

/**
 * @route "/api/v1/user/alluser"
 * @desc "This controller will help to get all data "
 * @Access { Public }
 * @method "Get"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

const getAllUser = AsyncHandler(async (req, res) => {
  const user = await User.find()
    .sort({
      updatedAt: -1,
    })
    .select("-password -createdAt -updatedAt -__v -notification -lead");
  res.status(200).json({
    message: "User get successful",
    data: user,
  });
});

/**
 * @route "/api/v1/user/addtoaccessories"
 * @desc "This controller will help Add Accesories "
 * @Access { Private }
 * @method "Post"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const addToUserAccessories = AsyncHandler(async (req, res) => {
  const { title, url } = req.body;
  let { _id } = req.tokenInfo;
  const user_accessories = await User.findOneAndUpdate(
    { _id },
    {
      $push: {
        accessories: {
          title,
          url,
        },
      },
    },
    {
      new: true,
    }
  ).select("accessories");

  res.status(201).json({
    message: "Accessories Create Success",
    data: user_accessories.accessories,
  });
});

/**
 * @route "/api/v1/user/removeFromUserAccessories"
 * @desc "This controller will help remove Accesories "
 * @Access { Private }
 * @method "Post"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const removeFromUserAccessories = AsyncHandler(async (req, res) => {
  const { id } = req.body;
  let { _id } = req.tokenInfo;
  const user_accessories = await User.findOneAndUpdate(
    { _id },
    {
      $pull: {
        accessories: {
          _id: id,
        },
      },
    },
    {
      new: true,
    }
  ).select("accessories");

  res.status(201).json({
    message: "Accessories Remove Success",
    data: user_accessories.accessories,
  });
});

module.exports = {
  createUser,
  loginUser,
  verifyUser,
  getAllUser,
  addToUserAccessories,
  removeFromUserAccessories,
};
