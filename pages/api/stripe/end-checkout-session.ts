// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";

import { client } from "../../../utils/sanityClient";

type ReqData = {
  checkoutId: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { checkoutId }: ReqData = req.body;

  await client.patch(checkoutId).set({ completed: true }).commit();

  res.status(200).json({ ok: true, message: "" });
};
