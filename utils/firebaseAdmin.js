import admin from "firebase-admin";
import serviceAccount from "../.firebase/serviceAccount.json";
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ill-intentions.firebaseio.com",
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
