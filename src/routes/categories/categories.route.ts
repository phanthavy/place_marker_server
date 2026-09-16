const express = require("express");
const categoryRouter = express.Router();
const { createCategories, getCategories } = require("../../controllers/categories/categories.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");

categoryRouter.post("/categories",authMiddleware, createCategories);
categoryRouter.get("/categories",authMiddleware, getCategories);

module.exports = categoryRouter;