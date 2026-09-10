import type { Request, Response } from "express";
const prisma = require("../../config/prisma");
const bcrypt = require("bcrypt");

exports.registerController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const checkEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (checkEmail) {
      return res
        .status(401)
        .json({ success: false, message: "this email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
      },
    });

    const payload = {
      u_id: newUser.u_id,
      email: newUser.email,
      role: newUser.role
    }

    res.status(200).json({ success: true, message: "registered success", data: payload});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "server failed" });
  }
};
