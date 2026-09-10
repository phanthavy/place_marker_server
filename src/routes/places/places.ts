const express = require("express");
const registerRouter = express.Router();
const { createPlace,getPlace } = require("../../controllers/places/places.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");

registerRouter.post("/places", authMiddleware, upload.array("images", 5), createPlace);
registerRouter.get("/places", authMiddleware, getPlace);

module.exports = registerRouter;
