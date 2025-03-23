import admin from "firebase-admin";

const serviceAccount = {
  type: "service_account",
  project_id: "web-ragamint",
  private_key_id: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY,
  client_email: "firebase-adminsdk-fbsvc@web-ragamint.iam.gserviceaccount.com",
  client_id: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: "googleapis.com",
};

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
