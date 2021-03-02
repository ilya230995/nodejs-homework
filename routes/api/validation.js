const Joi = require("joi");

const schemaCreateCat = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\+?3?8?(0\d{9})$/)
    .required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string().required(),
}).min(1);

const schemaUpdateCat = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .optional(),
  phone: Joi.string()
    .pattern(/^\+?3?8?(0\d{9})$/)
    .optional(),
  password: Joi.string().min(6).optional(),
  subscription: Joi.string().optional(),
}).min(1);

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

module.exports.createContact = (req, res, next) => {
  return validate(schemaCreateCat, req.body, next);
};
module.exports.updateContact = (req, res, next) => {
  return validate(schemaUpdateCat, req.body, next);
};
