const express = require("express");
const {
  createUser,
  loginUser,
  verifyUser,
  getAllUser,
  addToUserAccessories,
  removeFromUserAccessories,
} = require("../controller/userController");
const OnlyAdmin = require("../middleware/auth/AdminMiddleware");
const UserAuth = require("../middleware/auth/Authentication");
const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/createuser", UserAuth, OnlyAdmin, createUser);
userRouter.get("/alluser", UserAuth, getAllUser);
userRouter.post("/addtoaccessories", UserAuth, addToUserAccessories);
userRouter.post(
  "/removefromuseraccessories",
  UserAuth,
  removeFromUserAccessories
);
userRouter.post("/verify", UserAuth, verifyUser);

module.exports = userRouter;
