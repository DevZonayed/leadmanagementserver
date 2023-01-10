const OnlyAdmin = (req, res, next) => {
  let { role } = req.tokenInfo;
  let validRole = ["admin"];
  if (!validRole.includes(role)) {
    let error = new Error("Permission denied!");
    res.status(403);
    next(error);
    return;
  }
  next();
};

module.exports = OnlyAdmin;
