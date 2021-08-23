// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../utils/firebaseAdmin";
import Stripe from "stripe";
import { CheckoutSessions } from "../../../@types/db";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2020-08-27" });

type IntentData = {
  checkoutId: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { checkoutId }: IntentData = req.body;
  const data = await db
    .collection("checkoutSessions")
    .doc(checkoutId)
    .get()
    .then((doc) => doc.data() as CheckoutSessions);

  if (data.priceSet) {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.price,
      currency: "nzd",
    });
    await db.collection("checkoutSessions").doc(checkoutId).update({
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    });
    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } else {
    res.status(401);
  }
};
