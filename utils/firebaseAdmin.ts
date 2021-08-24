import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../.firebase/serviceAccount.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    databaseURL: "https://ill-intentions.firebaseio.com",
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
