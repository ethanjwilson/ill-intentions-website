// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

import { client } from "../../../utils/sanityClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2020-08-27" });

type IntentData = {
  checkoutId: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { checkoutId }: IntentData = req.body;
  const { priceSet, salePrice }: { priceSet: boolean; salePrice: number } = await client.fetch(`*[_type == "sale" && _id == "${checkoutId}"]{priceSet, salePrice}[0]`);
  if (priceSet) {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: salePrice,
      currency: "nzd",
    });
    await client.patch(checkoutId).set({ paymentIntentId: paymentIntent.id, clientSecret: paymentIntent.client_secret }).commit();
    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } else {
    res.status(401);
  }
};
