// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import { Sizes } from "../../../@types/db";
import { db } from "../../../utils/firebaseAdmin";

type SessionData = {
  itemId: string;
  size: Sizes;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { itemId, size }: SessionData = req.body;
  const checkoutId = uuid();

  await db.collection("checkoutSessions").doc(checkoutId).set({
    complete: false,
    itemId,
    size,
    priceSet: false,
  });

  res.status(201).json({ checkoutId });
};
