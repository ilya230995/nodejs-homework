const passport = require("passport");
require("../config/passport");
const { httpCode } = require("./constant");

const guard = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    const [_, token] = req.get("Authorization").split(" ");
    if (!user || err || token !== user.token) {
      return res.status(httpCode.FORBIDDEN).json({
        status: "error",
        code: httpCode.FORBIDDEN,
        data: "FORBIDDEN",
        message: "Access denied",
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = guard;
