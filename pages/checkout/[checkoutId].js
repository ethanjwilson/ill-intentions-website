import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { db } from "../../utils/firebaseAdmin";

const promise = loadStripe("pk_test_51ImZPPGEn4WButGw0oWggDjufEVo8LUw18VTPo2tdyUJxYkWXcVEcxLu3ZDF5F9VPzyUYHVVLeNFVdNNMhZEfaog00i0pNVWRT");

const PaymentForm = ({ clientSecret }) => {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const stripe = useStripe();
  const elements = useElements();

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Roboto, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };
  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };
  return (
    <Box borderRadius="lg" bg="gray.100" w={480} mx="auto" p={8}>
      <form id="payment-form" onSubmit={handleSubmit}>
        <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
        <Button colorScheme="blue" mt={8} isLoading={processing} disabled={processing || disabled || succeeded} type="submit">
          Pay Now
        </Button>
        {/* Show any error that happens when processing the payment */}
        {error && (
          <div className="card-error" role="alert">
            {error}
          </div>
        )}
        {/* Show a success message upon completion */}
        {/* <p className={succeeded ? "result-message" : "result-message hidden"}>
        Payment succeeded, see the result in your
        <a href={`https://dashboard.stripe.com/test/payments`}> Stripe dashboard.</a> Refresh the page to pay again.
      </p> */}
      </form>
    </Box>
  );
};

const Checkout = ({ data }) => {
  const { clientSecret } = data;
  return (
    <Box>
      <Stack my={8}>
        <Heading textAlign="center">Checkout</Heading>
      </Stack>
      <Stack>
        <Elements stripe={promise}>
          <PaymentForm clientSecret={clientSecret} />
        </Elements>
      </Stack>
    </Box>
  );
};

export const getServerSideProps = async (context) => {
  const checkoutId = context.params.checkoutId;
  const data = await db
    .collection("payment-intents")
    .doc(checkoutId)
    .get()
    .then((doc) => doc.data());
  if (!data) {
    console.log("Checkout session not found");
    context.res.writeHead(302, { location: "/" });
    context.res.end();
  }

  return {
    props: { data },
  };
};

export default Checkout;
