// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { v4 as uuid } from "uuid";
import { db } from "../../../utils/firebaseAdmin";

export default async (req, res) => {
  const { checkoutId, itemId, shipping = null } = req.body;

  const item = await db
    .collection("items")
    .doc(itemId)
    .get()
    .then((doc) => doc.data());

  let shippingCost = 0;
  if (shipping) {
    shippingCost = item?.shipping[shipping];
  }

  const price = shippingCost ? item.price + shippingCost : item.price;

  await db.collection("checkoutSessions").doc(checkoutId).update({
    complete: false,
    priceSet: true,
    price,
  });

  res.status(200).send();
};
