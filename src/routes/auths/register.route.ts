const express = require('express')
const registerRouter = express.Router()
const {registerController} = require('../../controllers/auths/register.controller')

registerRouter.post("/register", registerController);

module.exports = registerRouter