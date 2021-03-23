const User = require("./schemas/user");

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const findById = async (id) => {
  return await User.findOne({ _id: id });
};

const create = async ({ name, email, password, verifyToken }) => {
  const user = new User({ name, email, password, verifyToken });
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateAvatar = async (id, avatar) => {
  return await User.updateOne({ _id: id }, { avatar });
};
const findByVerifyToken = async (verifyToken) => {
  return await User.findOne({ verifyToken });
};
const updateVerifyToken = async (id, verifyToken) => {
  return await User.findOneAndUpdate({ _id: id }, { verifyToken });
};

module.exports = {
  findByEmail,
  findById,
  create,
  updateToken,
  updateAvatar,
  findByVerifyToken,
  updateVerifyToken,
};
