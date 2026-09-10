const express = require("express");
const categoryRouter = express.Router();
const { createCategories, getCategories } = require("../../controllers/categories/categories.controller");

categoryRouter.post("/categories", createCategories);
categoryRouter.get("/categories", getCategories);

module.exports = categoryRouter;