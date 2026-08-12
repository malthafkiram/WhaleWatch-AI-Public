const express = require("express");
const AuthController = require("../controllers/authController");
const router = express.Router();
const authentication = require("../middlewares/authentication");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/login-google", AuthController.loginGoogle);

router.use(authentication);
router.get("/profile", AuthController.getProfile);

module.exports = router;
