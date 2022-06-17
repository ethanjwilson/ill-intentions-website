// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";

import { db } from "../../../utils/firebaseAdmin";
import { client } from "../../../utils/sanityClient";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query;
  if (typeof slug !== "string") {
    return res.status(418).json({ ok: false, message: "Invalid Type" });
  }
  const data = client.fetch(`*[_type == "product" && slug.current == "${slug}"]`);
  res.status(200).json(data);
};
