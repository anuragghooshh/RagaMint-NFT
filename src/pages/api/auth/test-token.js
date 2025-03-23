import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!initializeApp.length) {
  initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({
      status: false,
      message: "Method Not Allowed",
    });

  try {
    const uid = "testUser123";
    const token = await getAuth().createCustomToken(uid);
    res.status(200).json({
      status: true,
      data: {
        token,
      },
      message: "Token generated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate token", details: error });
  }
}
