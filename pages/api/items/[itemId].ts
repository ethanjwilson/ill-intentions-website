// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../utils/firebaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { itemId } = req.query;
  if (typeof itemId !== "string") {
    return res.status(418).json({ ok: false, message: "Invalid Type" });
  }
  const data = await db
    .collection("items")
    .doc(itemId as string)
    .get()
    .then((doc) => doc.data());
  res.status(200).json(data);
};
