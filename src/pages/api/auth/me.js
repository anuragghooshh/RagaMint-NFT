import { verifyToken } from "@/lib/firebaseAdmin";

export default async function handler(req, res) {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  const user = await verifyToken(token);
  if (!user) return res.status(403).json({ error: "Invalid token" });

  res.status(200).json({ user });
}
