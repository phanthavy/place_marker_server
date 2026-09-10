const express = require("express");
const loginRouter = express.Router();
const { loginController } = require("../../controllers/auths/login.controller");

loginRouter.post("/login", loginController);

module.exports = loginRouter;
