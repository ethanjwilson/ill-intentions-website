// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cors from "cors";
import { buffer } from "micro";
import { db } from "../../utils/firebaseAdmin";
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
const stripe = require("stripe")("sk_test_51ImZPPGEn4WButGwGSHmHNfthMMCIY6WDp0Fyq7KLtwchYyQ1e1j4WsjU1G7SsoBv6WpF3OWxm34epz9Hlw7WaNV004F9kIBAN");
const endpointSecret = "whsec_9aQrl1xlIYPNzMQgbmJjfT5mp3dVVOc7";

export const config = {
  api: {
    bodyParser: false,
  },
};

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
            const { client_secret } = event.data.object;
            const data = await db
              .collection("payment-intents")
              .where("clientSecret", "==", client_secret)
              .get()
              .then((doc) => doc.data());
            console.log(data);
            console.log(`PaymentIntent for ${paymentIntent.client_secret} was successful!`);
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
        res.status(200).send();
        return;
      } catch (error) {
        console.log(`⚠️  Webhook signature verification failed.`, error.message);
        res.status(400).send();
        return;
      }
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
