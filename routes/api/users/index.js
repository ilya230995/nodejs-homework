const express = require("express");
const router = express.Router();
const usersController = require("../../../controllers/users");
const guard = require("../../../helpers/guard");
// const validate = require("./validation");

router.post("/auth/register", usersController.reg);
router.post("/auth/login", usersController.login);
router.post("/auth/logout", guard, usersController.logout);
router.get("/current", guard, usersController.getUsersData);

module.exports = router;
