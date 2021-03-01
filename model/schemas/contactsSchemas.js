const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Set email for contact"],
    },
    phone: {
      type: String,
      match: /^\+?3?8?(0\d{9})$/,
      required: [true, "Set phone for contact"],
    },
    subscription: {
      type: String,
      enum: ["free", "pro", "premium"],
      required: [true, "Set subscription for contact"],
    },
    password: {
      type: String,
      required: [true, "Set password for contact"],
    },
    token: {
      type: String,
      default: "",
    },
  },
  { versionKey: false, timestamps: true }
);

const Contact = model("contact", contactsSchema);

module.exports = Contact;
