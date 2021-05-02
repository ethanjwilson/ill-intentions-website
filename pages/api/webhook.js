// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cors from "cors";
import { buffer } from "micro";
// Initializing the cors middleware
const cors = Cors({
  methods: ["POST", "HEAD"],
});
// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}
import { db } from "../../utils/firebaseAdmin";
const stripe = require("stripe")("sk_test_51ImZPPGEn4WButGwGSHmHNfthMMCIY6WDp0Fyq7KLtwchYyQ1e1j4WsjU1G7SsoBv6WpF3OWxm34epz9Hlw7WaNV004F9kIBAN");
const endpointSecret = "whsec_9aQrl1xlIYPNzMQgbmJjfT5mp3dVVOc7";

export default async (req, res) => {
  await runMiddleware(req, res, cors);

  if (req.method === "POST") {
    if (endpointSecret) {
      try {
        const buf = await buffer(req);
        const signature = req.headers["stripe-signature"];
        const event = stripe.webhooks.constructEvent(buf, signature, endpointSecret);
        switch (event.type) {
          case "payment_intent.succeeded":
            const paymentIntent = event.data.object;
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            break;
          case "payment_method.attached":
            const paymentMethod = event.data.object;
            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
          default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
        }
        return res.status(200);
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.status(400);
      }
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
  // await db.collection("payment-intents").doc(checkoutId).update({
  //   complete: true,
  // });
};

export const config = {
  api: {
    bodyParser: false,
  },
};
