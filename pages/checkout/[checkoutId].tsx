import { loadStripe, StripeCardElementChangeEvent } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";

import Image from "next/image";
import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState, MouseEvent } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { db } from "../../utils/firebaseAdmin";
import useSWR from "swr";
import axios from "axios";
import { FormProvider, useForm } from "react-hook-form";
import CheckoutForm from "../../components/checkout/CheckoutForm";
import CheckoutShell from "../../components/checkout/CheckoutShell";
import checkoutFormScheme from "../../schemas/checkoutFormSchema";
import { imageLoader } from "../../utils/imageLoader";
import { Dispatch, SetStateAction } from "react";
import { CheckoutSessions, Countries, Item } from "../../@types/db";
import { GetServerSideProps } from "next";

const promise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

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
    <Box borderRadius="lg" bg="white" p={8}>
      <form id="payment-form">
        <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
        <Button colorScheme="blue" mt={8} isLoading={processing} disabled={processing || disabled || succeeded} onClick={handleSubmit}>
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

const fetcher = <T,>(url: string) => axios.get(url).then(({ data }: { data: T }) => data);

interface CheckoutInterface {
  itemId: string;
  checkoutId: string;
}

type FormValues = {
  area: string;
  city: string;
  code: number;
  country: Countries;
  address: string;
  email: string;
  firstName: string;
  lastName: string;
  isShipped: boolean;
};

const Checkout = ({ data }: { data: CheckoutInterface & CheckoutSessions }) => {
  const [priceSet, setPriceSet] = useState(data?.clientSecret ? true : false);
  const [clientSecret, setClientSecret] = useState(data?.clientSecret ?? "");
  const [email, setEmail] = useState(data?.customer?.email ?? "");
  const { itemId, checkoutId, complete, size } = data;
  const { data: item } = useSWR<Item>(`/api/items/${itemId}`, fetcher);

  const methods = useForm<FormValues>({
    mode: "all",
    reValidateMode: "onChange",
    resolver: yupResolver(checkoutFormScheme),
  });
  const {
    formState: { isDirty, isValid },
  } = methods;
  const onSubmit = (data: FormValues) => {
    const shippingAddress = data.isShipped
      ? {
          streetAddress: data.address,
          city: data.city,
          code: data.code,
          area: data.area,
          country: data.country,
        }
      : false;
    axios
      .post("/api/stripe/update-checkout-session", {
        itemId,
        checkoutId,
        customer: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          shippingAddress,
        },
        country: data.isShipped ? data.country : false,
      })
      .then(() => {
        setPriceSet(true);
        setEmail(data.email);
      });
  };

  return complete ? (
    <Box bg="gray.100" minH="100vh">
      <Stack py={8}>
        <Heading textAlign="center">Thank you for your purchase</Heading>
      </Stack>

      {item && (
        <Stack maxW={480} mx="auto" bg="white" spacing={4} p={4} borderRadius="lg">
          <Stack>
            <Box>
              <Text fontSize="lg" fontWeight="bold">
                {item.name}
              </Text>
              <Stack direction="row">
                <Text>${item.price / 100}</Text>
                <Text>Size: {size.toUpperCase()}</Text>
              </Stack>
            </Box>
            <Image priority loader={imageLoader} src={`${item.images[0]}.webp`} alt={`Picture of ${item.name}`} width={500} height={500} />
          </Stack>
        </Stack>
      )}
    </Box>
  ) : (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <CheckoutShell>
            <Stack>
              <Heading mb={4}>Checkout</Heading>
              <CheckoutForm disabled={priceSet} />
              {priceSet && (
                <Stack>
                  <Elements stripe={promise}>
                    <PaymentForm email={email} clientSecret={clientSecret} setClientSecret={setClientSecret} checkoutId={checkoutId} />
                  </Elements>
                </Stack>
              )}
            </Stack>
            <Box>
              {item && (
                <Stack bg="white" spacing={4} p={4} borderRadius="lg">
                  <Box>
                    <Text fontSize="lg" fontWeight="bold">
                      {item.name}
                    </Text>
                    <Stack direction="row">
                      <Text>${item.price / 100}</Text>
                      <Text>Size: {size.toUpperCase()}</Text>
                    </Stack>
                  </Box>
                  <Image priority loader={imageLoader} src={`${item.images[0]}.webp`} alt={`Picture of ${item.name}`} width={500} height={500} />
                  <Button colorScheme="blue" type="submit" disabled={!isDirty || !isValid || priceSet}>
                    Continue to payment
                  </Button>
                </Stack>
              )}
            </Box>
          </CheckoutShell>
        </form>
      </FormProvider>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const checkoutId = context.params.checkoutId;
  let data: CheckoutSessions;
  if (typeof checkoutId === "string") {
    data = await db
      .collection("checkoutSessions")
      .doc(checkoutId)
      .get()
      .then((doc) => doc.data() as CheckoutSessions);
  }
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
