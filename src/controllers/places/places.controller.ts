import type { Request, Response } from "express";
const prisma = require("../../config/prisma");
const { uploadToCloudinary } = require("../../config/cloudinary");

exports.createPlace = async (req: Request, res: Response) => {
  try {
    const { name, area, description, latitude, longitude, category_id } =
      req.body;

    if (latitude == null || longitude == null || category_id === null) {
      return res.status(409).json({
        success: false,
        message: "latitude, longitude and category are required",
      });
    }

    const existingInDB = await prisma.place.findFirst({
      where: {
        name: name,
      },
    });

    if (existingInDB)
      return res.status(409).json({
        success: false,
        message: "This location's name already exists!",
      });

    const files = (req.files as Express.Multer.File[]) || [];
    const uploadedImages = [];

    for (const file of files) {
      const img = await uploadToCloudinary(file);
      uploadedImages.push(img);
    }

    let imageUrls: string[] = [];
    const raw = req.body.imageUrls || req.body.images;
    if (typeof raw === "string" && raw.trim()) {
      try {
        const parsed = JSON.parse(raw);
        imageUrls = Array.isArray(parsed) ? parsed : [raw];
      } catch {
        imageUrls = [raw];
      }
    }

    for (const url of imageUrls) {
      uploadedImages.push(await uploadToCloudinary(url));
    }

    const place = await prisma.place.create({
      data: {
        name: name,
        area: area,
        description: description,
        latitude: Number(latitude),
        longitude: Number(longitude),
        category_id: Number(category_id),
        user_id: (req as any).user?.u_id ?? null,
        images: {
          create: uploadedImages.map((img: any, i: number) => ({
            url: img.url,
            public_id: img.public_id,
            sortOrder: i,
          })),
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            u_id: true,
            email: true,
            role: true,
          },
        },
        images: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "created a place successfully",
      data: place,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "server failed" });
  }
};

exports.getPlace = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [place, total] = await Promise.all([
      prisma.place.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              u_id: true,
              email: true,
              role: true,
            },
          },
          images: {
            select: {
              id: true,
              url: true,
              caption: true,
              sortOrder: true,
            },
            orderBy: { sortOrder: "asc" },
          },
        },
      }),
      prisma.place.count(),
    ]);

    res.status(200).json({
      success: true,
      message: "retrived place successfully",
      pagination: {
        page,
        limit,
        total,
        toltalPages: Math.ceil(total / limit),
      },
      data: place,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "server failed" });
  }
};
