require("dotenv").config();
const { v2: cloudinary } = require("cloudinary");

type UploadFile = {
  buffer: Buffer;
  mimetype: string;
};

const uploadToCloudinary = async (fileOrUrl: UploadFile | string) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  if (typeof fileOrUrl === "string") {
    const result = await cloudinary.uploader.upload(fileOrUrl, {
      folder: "places",
    });
    return { url: result.secure_url, public_id: result.public_id };
  }

  const b64 = Buffer.from(fileOrUrl.buffer).toString("base64");
  const dataURI = `data:${fileOrUrl.mimetype};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: "places",
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};

module.exports = { uploadToCloudinary };
