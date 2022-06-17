// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sha256 from "crypto-js/sha256";
import { NextApiRequest, NextApiResponse } from "next";

import { CheckoutSessions, Countries, Item } from "../../../@types/db";
import { db } from "../../../utils/firebaseAdmin";
import { client } from "../../../utils/sanityClient";

type ReqData = {
  checkoutId: string;
  itemId: string;
  country: Countries;
  customer: CheckoutSessions["customer"];
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { checkoutId, country, customer }: ReqData = req.body;

  const customerId = sha256(customer.email).toString();

  // const item = await db
  //   .collection("items")
  //   .doc(itemId)
  //   .get()
  //   .then((doc) => doc.data() as Item);

  const { price, shippingPrices }: { price: number; shippingPrices: { nzl: number } } = await client.fetch(
    `*[_type == "sale" && _id == "${checkoutId}"]{ productVariant->{ price, shippingPrices }}[0].productVariant`
  );

  let shippingPrice = shippingPrices[country] ?? 0;
  const salePrice = shippingPrice ? price + shippingPrice : price;

  await client
    .transaction()
    .createOrReplace({
      _type: "customer",
      _id: customerId,
      ...customer,
    })
    .patch(checkoutId, (p) => p.set({ salePrice, priceSet: true, customer: { _type: "reference", _ref: customerId } }))
    .commit()
    .catch((err) => {
      console.error("Transaction failed: ", err.message);
    });

  // await db.collection("checkoutSessions").doc(checkoutId).update({
  //   complete: false,
  //   priceSet: true,
  //   price,
  //   customer,
  // });

  res.status(200).json({ ok: true, message: "" });
};
