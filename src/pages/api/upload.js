import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
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

  const form = formidable();

  try {
    const [fields, files] = await form.parse(req);

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({
        status: false,
        message: "No file uploaded",
      });
    }

    const { filepath: filePath, originalFilename: fileName } = file;
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
      console.error("Cloudinary upload error:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error during upload" });
    }
  } catch (err) {
    console.error("Form parsing error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error during form parsing",
    });
  }
}
