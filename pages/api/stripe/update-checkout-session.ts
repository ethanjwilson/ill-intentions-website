// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { CheckoutSessions, Countries, Item } from "../../../@types/db";
import { db } from "../../../utils/firebaseAdmin";

type ReqData = {
  checkoutId: string;
  itemId: string;
  country: Countries;
  customer: CheckoutSessions["customer"];
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { checkoutId, itemId, country, customer }: ReqData = req.body;

  const item = await db
    .collection("items")
    .doc(itemId)
    .get()
    .then((doc) => doc.data() as Item);

  let shippingCost = item?.shipping[country] ?? 0;
  const price = shippingCost ? item.price + shippingCost : item.price;

  await db.collection("checkoutSessions").doc(checkoutId).update({
    complete: false,
    priceSet: true,
    price,
    customer,
  });

  res.status(200).json({ ok: true, message: "" });
};
