import { v2 as cloudinary } from "cloudinary";
import { formidable } from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    }

    const { path: filePath, name: fileName } = files.file;
    const uniqueFilename = `${Date.now()}-${fileName}`;

    try {
      const { secure_url } = await cloudinary.uploader.upload(filePath, {
        public_id: `uploads/${uniqueFilename}`,
        tags: "uploads",
      });

      fs.unlinkSync(filePath);

      return res.status(200).json({
        message: "File uploaded successfully",
        data: {
          url: secure_url,
        },
        status: true,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
}
