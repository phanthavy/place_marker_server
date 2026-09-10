import type { Request, Response } from "express";
const prisma = require("../../config/prisma");

exports.adminController = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true,
      },
    });

    res
      .status(200)
      .json({ success: true, message: "retrived users successfully", data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "server failed" });
  }
};
