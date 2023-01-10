const express = require("express");
const cors = require("cors");
const mongoConnection = require("./api/config/databaseConfig");
const envairomentVariable = require("dotenv");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const {
  errorMiddleware,
  notFoundMiddleware,
} = require("./api/middleware/error/errorMiddleware");
const userRouter = require("./api/router/UserRouter");
const subjectRouter = require("./api/router/SubjectRouter");
const sessionRouter = require("./api/router/SessionRouter");
const emailTemplateRouter = require("./api/router/EmailTemplateRouter");
const SettingsRouter = require("./api/router/SettingsRouter");
const LeadRouter = require("./api/router/LeadRouter");
const messageRouter = require("./api/router/messageRouter");
const mailRouter = require("./api/router/mailRouter");
const dashBordRouter = require("./api/router/dashBordRouter");
const getOrders = require("./api/utils/woocommerceApi/admittedStudents");
const path = require("path");
const expressAsyncHandler = require("express-async-handler");
require("colors");
// App Initialize
const app = express();
envairomentVariable.config();

// All middleware goes here
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.set("trust proxy", true);
app.use(cookieParser());
app.use(
  express.json({
    limit: "50mb",
  })
);

app.get(
  "/",
  expressAsyncHandler(async (req, res, next) => {
    const data = await getOrders();

    res.status(200).json({
      message: "Data get Successful",
      data: JSON.parse(data).data,
    });
  })
);

// User Router
app.use("/api/v1/user", userRouter);
app.use("/api/v1/lead", LeadRouter);
app.use("/api/v1/subject", subjectRouter);
app.use("/api/v1/session", sessionRouter);
app.use("/api/v1/template", emailTemplateRouter);
app.use("/api/v1/settings", SettingsRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/mail", mailRouter);
app.use("/api/v1/dashbord", dashBordRouter);

// Error Middleware
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// Listening to port
const PORT = process.env.SERVER_PORT || 7000;
app.listen(PORT, () => {
  mongoConnection();
  console.log(`Server is running in port ${PORT}`.bgGreen.black);
});
// Listening to port
// const PORT = process.env.SERVER_PORT || 7000;
// mongoConnection();

// module.exports = app;
