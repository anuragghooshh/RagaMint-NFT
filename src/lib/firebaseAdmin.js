import admin from "firebase-admin";

const serviceAccount = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const verifyToken = async (token) => {
  try {
    return await admin.auth().verifyIdToken(token);
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};
