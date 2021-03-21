const Joi = require("joi");
const { httpCode } = require("../../../helpers/constant");

const regUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string().optional(),
}).min(1);

const login = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string().min(6).required(),
}).min(1);

const uploadAvatar = (req, res, next) => {
  if (!req.file) {
    return res.status(httpCode.BAD_REQUEST).json({
      status: "error",
      code: httpCode.BAD_REQUEST,
      data: "Bad request",
      message: "Avatar field with file not found",
    });
  }
  next();
};

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: 400,
      message,
    });
  }
  next();
};

module.exports.createUser = (req, res, next) => {
  return validate(regUser, req.body, next);
};
module.exports.loginUser = (req, res, next) => {
  return validate(login, req.body, next);
};
module.exports.uploadAvatar = uploadAvatar;
