const express = require("express");
const router = express.Router();
const emailCheck = require("../middleware/verifyEmail");
const passwordCheck = require("../middleware/passwordValidation");
const userCtrl = require("../controllers/user");

router.post("/signup", emailCheck, passwordCheck, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
