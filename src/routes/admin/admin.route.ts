const express = require("express");
const registerRouter = express.Router();
const { adminController } = require("../../controllers/admin/admin.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { roleMiddleware } = require("../../middlewares/role.middleware");

registerRouter.get("/admin", authMiddleware, roleMiddleware("admin"), adminController);

module.exports = registerRouter;
