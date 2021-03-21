const jwt = require("jsonwebtoken");
const Users = require("../model/users");
const path = require("path");
const Jimp = require("jimp");
const fs = require("fs").promises;
const createFolderExist = require("../helpers/create-dir");
const { httpCode } = require("../helpers/constant");
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET;

const reg = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Users.findByEmail(email);
    if (user) {
      return res.status(httpCode.CONFLICT).json({
        status: "error",
        code: httpCode.CONFLICT,
        data: "Conflict",
        message: "Email in use",
      });
    }
    const newUser = await Users.create(req.body);
    return res.status(httpCode.CREATED).json({
      status: "succes",
      code: httpCode.CREATED,
      data: {
        user: {
          email: newUser.email,
          name: newUser.name,
          subscription: newUser.subscription,
          avatar: newUser.avatarURL,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    if (!user || !user.validPassword(password)) {
      return res.status(httpCode.UNAUTHORIZED).json({
        status: "error",
        code: httpCode.UNAUTHORIZED,
        data: "UNAUTHORIZED",
        message: "Invalid credentials",
      });
    }
    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });
    await Users.updateToken(id, token);
    return res.status(httpCode.OK).json({
      status: "succes",
      code: httpCode.OK,
      data: {
        token,
      },
    });
  } catch (e) {
    next(e);
  }
};
const logout = async (req, res, next) => {
  const id = req.user.id;
  await Users.updateToken(id, null);
  return res.status(httpCode.NO_CONTENT).json({});
};

const getUsersData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(httpCode.UNAUTHORIZED).json({
        status: "error",
        code: httpCode.UNAUTHORIZED,
        data: "UNAUTHORIZED",
        message: "Not authorized",
      });
    }
    return res.status(httpCode.OK).json({
      status: "succes",
      code: httpCode.OK,
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const avatarURL = await saveAvatarToStatic(req);
    await Users.updateAvatar(id, avatarURL);
    return res.json({
      status: "succes",
      code: httpCode.OK,
      data: {
        avatarURL,
      },
    });
  } catch (e) {
    next(e);
  }
};
const saveAvatarToStatic = async (req) => {
  const id = req.user.id;
  const AVATARS = process.env.AVATARS;
  const pathFile = req.file.path;
  const newNameAvatar = `${Date.now()}-${req.file.originalname}`;
  const img = await Jimp.read(pathFile);
  await img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile);
  await createFolderExist(path.join(AVATARS, id));
  await fs.rename(pathFile, path.join(AVATARS, id, newNameAvatar));
  const avatarURL = path.normalize(path.join(id, newNameAvatar));
  try {
    await fs.unlink(path.join(process.cwd(), AVATARS, req.user.avatarURL));
  } catch (error) {
    console.log(error.message);
  }
  return avatarURL;
};

module.exports = {
  reg,
  login,
  logout,
  getUsersData,
  avatars,
};
