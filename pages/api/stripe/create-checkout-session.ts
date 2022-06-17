// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";

import { Sizes } from "../../../@types/db";
import { client } from "../../../utils/sanityClient";

type SessionData = {
  productId: string;
  productVariantId: string;
  size: Sizes;
};

export default async (req: NextApiRequest, res: NextApiResponse<{ checkoutId: string }>) => {
  const { productId, productVariantId, size } = <SessionData>req["body"];

  const data = await client.create({
    _type: "sale",
    size: size,
    priceSet: false,
    completed: false,
    product: {
      _type: "reference",
      _ref: productId,
    },
    productVariant: {
      _type: "reference",
      _ref: productVariantId,
    },
  });

  res.status(201).json({ checkoutId: data._id });
};
