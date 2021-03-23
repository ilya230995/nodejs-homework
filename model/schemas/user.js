const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const SALT_WORK_FACTOR = 10;
const { subscription } = require("../../helpers/constant");

const userSchema = new Schema(
  {
    avatarURL: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: "250" }, true);
      },
    },
    name: {
      type: String,
      minlength: 2,
      default: "Guest",
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email required"],
      validate(value) {
        const re = /\S+@\S+\.\S+/;
        return re.test(String(value).toLowerCase());
      },
    },
    password: {
      type: String,
      required: [true, "Password required"],
    },
    subscription: {
      type: String,
      enum: {
        values: [subscription.FREE, subscription.PRO, subscription.PREMIUM],
        message: "It isn't allowed",
      },
      default: subscription.FREE,
    },
    token: {
      type: String,
      default: null,
    },
    verifyToken: {
      type: String,
      required: [true, "verify token required"],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt, null);
  next();
});

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model("user", userSchema);

module.exports = User;
