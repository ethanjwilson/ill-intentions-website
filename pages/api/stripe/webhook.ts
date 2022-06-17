// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cors from "cors";
import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

//Initialise Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2020-08-27" });
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

// Initialise the cors middleware
const cors = Cors({
  methods: ["POST", "HEAD"],
});
// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, cors);
  if (req.method === "POST") {
    if (endpointSecret) {
      try {
        const buf = await buffer(req);
        const signature = req.headers["stripe-signature"];
        const event = stripe.webhooks.constructEvent(buf, signature, endpointSecret);
        switch (event.type) {
          case "payment_intent.succeeded":
            const { id } = event.data.object as Stripe.PaymentIntent;
            // const data = await db
            //   .collection("checkoutSessions")
            //   .where("paymentIntentId", "==", id)
            //   .get()
            //   .then((snap) => {
            //     const tempArray = [];
            //     snap.forEach((docRef) => {
            //       const doc = docRef.data();
            //       doc.id = docRef.id;
            //       tempArray.push(doc);
            //     });
            //     return tempArray[0] as CheckoutSessions & { id: string };
            //   });

            // db.collection("checkoutSessions").doc(data.id).update({
            //   complete: true,
            // });

            // // TODO
            // // Decreament Stock

            // const { customer, size, itemId } = data;
            // db.collection("sales").add({
            //   paymentIntentId: id,
            //   createdAt: new Date().toISOString(),
            //   itemId,
            //   size,
            //   chargeAmount: data.price,
            //   customer,
            // });
            break;
          default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
        }
        res.status(200);
        return;
      } catch (error) {
        console.log(`⚠️  Webhook signature verification failed.`, error.message);
        res.status(400);
        return;
      }
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
