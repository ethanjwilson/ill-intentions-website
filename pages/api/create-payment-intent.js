// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { v4 as uuid } from "uuid";
import { db } from "../../utils/firebaseAdmin";
const stripe = require("stripe")("sk_test_51ImZPPGEn4WButGwGSHmHNfthMMCIY6WDp0Fyq7KLtwchYyQ1e1j4WsjU1G7SsoBv6WpF3OWxm34epz9Hlw7WaNV004F9kIBAN");

export default async (req, res) => {
  const { itemId, size = "l" } = req.body;
  const checkoutId = uuid();

  const data = await db
    .collection("items")
    .doc(itemId)
    .get()
    .then((doc) => doc.data());

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: data.price,
    currency: "nzd",
  });

  await db.collection("payment-intents").doc(checkoutId).set({
    complete: false,
    itemId,
    size,
    clientSecret: paymentIntent.client_secret,
  });

  res.status(201).json({ checkoutId });
};
