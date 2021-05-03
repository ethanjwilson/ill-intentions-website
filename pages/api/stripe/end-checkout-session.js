// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { v4 as uuid } from "uuid";
import { db } from "../../../utils/firebaseAdmin";

export default async (req, res) => {
  const { checkoutId } = req.body;

  await db.collection("checkoutSessions").doc(checkoutId).update({
    complete: true,
  });

  res.status(200).send();
};
