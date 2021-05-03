// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { v4 as uuid } from "uuid";
import { db } from "../../../utils/firebaseAdmin";

export default async (req, res) => {
  const { itemId, size = "l" } = req.body;
  const checkoutId = uuid();

  await db.collection("checkoutSessions").doc(checkoutId).set({
    complete: false,
    itemId,
    size,
    priceSet: false,
  });

  res.status(201).json({ checkoutId });
};
