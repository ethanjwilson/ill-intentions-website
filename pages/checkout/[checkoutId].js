import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import Image from "next/image";
import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { db } from "../../utils/firebaseAdmin";
import useSWR from "swr";
import axios from "axios";

const promise = loadStripe("pk_test_51ImZPPGEn4WButGw0oWggDjufEVo8LUw18VTPo2tdyUJxYkWXcVEcxLu3ZDF5F9VPzyUYHVVLeNFVdNNMhZEfaog00i0pNVWRT");

const PaymentForm = ({ checkoutId }) => {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    axios.post("/api/stripe/create-payment-intent", { checkoutId }).then(({ data }) => setClientSecret(data.clientSecret));
  }, []);

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

const fetcher = (url) => axios.get(url).then(({ data }) => data);

const imageLoader = ({ src, width }) =>
  `https://firebasestorage.googleapis.com/v0/b/ill-intentions.appspot.com/o/webp%2F${width}px%2F${src}?alt=media&token=121eebf5-b318-4705-8bbf-9e80e597f231`;

const Checkout = ({ data }) => {
  const [priceSet, setPriceSet] = useState(false);
  const { itemId, checkoutId } = data;
  const { data: item } = useSWR(`/api/items/${itemId}`, fetcher);

  const handleStartPayment = () => {
    axios.post("/api/stripe/update-checkout-session", { itemId, checkoutId, shipping: "nz" }).then(() => setPriceSet(true));
  };

  return (
    <Box>
      <Stack my={8}>
        <Heading textAlign="center">Checkout</Heading>
      </Stack>

      {item && (
        <Stack maxW={480} mx="auto" bg="gray.100" my={4} spacing={4} p={4}>
          <Text>{item.name}</Text>
          <Text>${item.price / 100}</Text>
          <Image priority loader={imageLoader} src={`${item.images[0]}.webp`} alt={`Picture of ${item.name}`} width={500} height={500} />
          <Button colorScheme="blue" onClick={handleStartPayment}>
            Go to payment
          </Button>
        </Stack>
      )}

      <Stack>
        <Elements stripe={promise}>{priceSet && <PaymentForm checkoutId={checkoutId} />}</Elements>
      </Stack>
    </Box>
  );
};

export const getServerSideProps = async (context) => {
  const checkoutId = context.params.checkoutId;
  const data = await db
    .collection("checkoutSessions")
    .doc(checkoutId)
    .get()
    .then((doc) => doc.data());
  if (!data) {
    console.log("Checkout session not found");
    context.res.writeHead(302, { location: "/" });
    context.res.end();
  }

  return {
    props: { data: { ...data, checkoutId } },
  };
};

export default Checkout;
