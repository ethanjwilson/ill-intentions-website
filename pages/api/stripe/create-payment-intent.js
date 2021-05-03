// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "../../../utils/firebaseAdmin";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const { checkoutId } = req.body;
  const data = await db
    .collection("checkoutSessions")
    .doc(checkoutId)
    .get()
    .then((doc) => doc.data());

  if (data.priceSet) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.price,
      currency: "nzd",
    });
    await db.collection("checkoutSessions").doc(checkoutId).update({
      paymentIntentId: paymentIntent.id,
    });
    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } else {
    res.status(401);
  }
  // Create a PaymentIntent with the order amount and currency

  // await db.collection("").doc(checkoutId).set({
  //   complete: false,
  //   itemId,
  //   size,
  //   clientSecret: paymentIntent.client_secret,
  // });
};
