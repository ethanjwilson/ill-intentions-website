import { StripeCardElementChangeEvent } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import { useEffect, useState, MouseEvent } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";

interface PaymentFormInterface {
  checkoutId: string;
  setClientSecret: Dispatch<SetStateAction<string>>;
  clientSecret: string;
  email: string;
}

const PaymentForm = ({ checkoutId, setClientSecret, clientSecret, email }: PaymentFormInterface) => {
  const router = useRouter();
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean | null>(null);
  const [disabled, setDisabled] = useState(true);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    axios.post("/api/stripe/create-payment-intent", { checkoutId }).then(({ data }: { data: { clientSecret: string } }) => setClientSecret(data.clientSecret));
  }, []);

  const cardStyle = {
    hidePostalCode: true,
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
  const handleChange = async (event: StripeCardElementChangeEvent) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };
  const handleSubmit = async (event: MouseEvent) => {
    event.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      receipt_email: email,
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      await axios.post("/api/stripe/end-checkout-session", { checkoutId });
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      router.reload();
    }
  };
  return (
    <Stack bg="white" p={4} borderRadius="lg">
      <Heading fontSize="xl" my={2}>
        Payment Details
      </Heading>
      <Box pt={4} id="payment-form">
        <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
        <Button isFullWidth colorScheme="blue" mt={8} isLoading={processing} disabled={processing || disabled || succeeded} onClick={handleSubmit}>
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
      </Box>
    </Stack>
  );
};

export default PaymentForm;
