// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../utils/firebaseAdmin";

type ReqData = {
  checkoutId: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { checkoutId }: ReqData = req.body;

  await db.collection("checkoutSessions").doc(checkoutId).update({
    complete: true,
  });

  res.status(200).json({ ok: true, message: "" });
};
