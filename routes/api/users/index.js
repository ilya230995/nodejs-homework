const express = require("express");
const router = express.Router();
const usersController = require("../../../controllers/users");
const guard = require("../../../helpers/guard");
const upload = require("../../../helpers/upload");
const validate = require("./validation");

router.post("/auth/register", validate.createUser, usersController.reg);
router.post("/auth/login", validate.loginUser, usersController.login);
router.post("/auth/logout", guard, usersController.logout);
router.get("/current", guard, usersController.getUsersData);
router.patch(
  "/avatars",
  [guard, upload.single("avatar"), validate.uploadAvatar],
  usersController.avatars
);

router.get("/auth/verify/:verificationToken", usersController.verify);

module.exports = router;
