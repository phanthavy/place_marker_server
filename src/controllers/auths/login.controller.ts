import type { Request, Response } from "express";
const prisma = require("../../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

exports.loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "invalid email and password" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      res
        .status(401)
        .json({ success: false, message: "invalid email and password" });
    }

    const payload = {
      u_id: user.u_id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {expiresIn: process.env.EXPIRES_IN})

    res
      .status(200)
      .json({ success: true, message: "login success", data: payload, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "server failed" });
  }
};
