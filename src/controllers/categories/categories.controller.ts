import type { Request, Response } from "express";
const prisma = require("../../config/prisma");

exports.createCategories = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const existingInDB = await prisma.category.findUnique({
      where : {
        name: name
      }
    })

    if (existingInDB) return res.status(500).json({ success: false, message: "this category already exists!" });

    const categories = await prisma.category.create({
      data: {
        name: name,
      }
    });

    res.status(200).json({
      success: true,
      message: "created a category successfully",
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "server failed" });
  }
};

exports.getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      message: "retrived categories successfully",
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "server failed" });
  }
};
