const express = require("express");
const registerRouter = express.Router();
const { getUsers } = require("../../controllers/users/users.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");

registerRouter.get("/users", authMiddleware, getUsers);

module.exports = registerRouter;
