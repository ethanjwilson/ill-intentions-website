import axios from "axios";
import { GetServerSideProps } from "next";
import { useNextSanityImage, UseNextSanityImageProps } from "next-sanity-image";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { Countries } from "../../@types/db";
import CheckoutForm from "../../components/checkout/CheckoutForm";
import CheckoutShell from "../../components/checkout/CheckoutShell";
import PaymentForm from "../../components/checkout/PaymentForm";
import checkoutFormSchema from "../../schemas/checkoutFormSchema";
import { client } from "../../utils/sanityClient";

// http://localhost:3000/checkout/vOYBmzG0R4TianHAkusWsI

const promise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

type FormValues = {
  area: string;
  city: string;
  code: number;
  address: string;
  country: Countries;
  isShipped: boolean;
  email: string;
  firstName: string;
  lastName: string;
};

const Checkout = ({ data }) => {
  const [priceSet, setPriceSet] = useState(data?.clientSecret ? true : false);
  const [clientSecret, setClientSecret] = useState(data?.clientSecret ?? "");
  const [email, setEmail] = useState(data?.customer?.email ?? "");
  const { _id: checkoutId, complete, size } = data;

  const item = { ...data.product, ...data.productVariant };
  const imageProps: UseNextSanityImageProps = useNextSanityImage(client, item.images[0]);

  const methods = useForm<FormValues>({
    mode: "all",
    reValidateMode: "onChange",
    resolver: yupResolver(checkoutFormSchema),
  });

  useEffect(() => {
    const repopulateForm = () => {
      const cachedFormData = localStorage.getItem(checkoutId);

      if (cachedFormData) {
        const formData = JSON.parse(cachedFormData) as FormValues;
        Object.keys(formData).map((key: keyof FormValues) => {
          methods.setValue(key, formData[key], { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        });
      }
    };
    repopulateForm();
  }, [priceSet]);

  const {
    formState: { isDirty, isValid },
  } = methods;
  const onSubmit = (data: FormValues) => {
    const shippingAddress = data.isShipped
      ? {
          streetAddress: data.address,
          city: data.city,
          code: data.code,
          area: data.area.split("-")[0],
          country: data.country,
        }
      : false;
    axios
      .post("/api/stripe/update-checkout-session", {
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
        localStorage.setItem(
          checkoutId,
          JSON.stringify({
            address: data.address,
            city: data.city,
            code: data.code,
            area: data.area,
            country: data.isShipped ? data.country : "",
            isShipped: data.isShipped,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          })
        );
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
            <Image {...imageProps} priority placeholder="blur" alt={`Picture of ${item.title}`} layout="responsive"></Image>
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
              <Flex alignItems="center">
                <Heading mb={4}>Checkout</Heading>
                {priceSet && (
                  <Box ml="auto">
                    <Button colorScheme="blue" onClick={() => setPriceSet(false)}>
                      Back
                    </Button>
                  </Box>
                )}
              </Flex>
              {priceSet ? (
                <>
                  <Stack>
                    <Elements stripe={promise}>
                      <PaymentForm email={email} clientSecret={clientSecret} setClientSecret={setClientSecret} checkoutId={checkoutId} />
                    </Elements>
                  </Stack>
                </>
              ) : (
                <>
                  <CheckoutForm disabled={priceSet} />
                  <Stack bg="white" spacing={4} p={4} borderRadius="lg">
                    <Button colorScheme="blue" type="submit" disabled={!isDirty || !isValid || priceSet}>
                      Continue to payment
                    </Button>
                  </Stack>
                </>
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
                      <Text>Size: {data.size.toUpperCase()}</Text>
                    </Stack>
                  </Box>
                  <Image {...imageProps} priority placeholder="blur" alt={`Picture of ${item.title}`} layout="responsive"></Image>
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
  let data;
  if (typeof checkoutId === "string") {
    data = await client.fetch(`*[_type == "sale" && _id == "${checkoutId}"] {
      ...,
      product->,
      productVariant->,
    }`);
  }

  const checkoutData = data[0];

  if (!checkoutData) {
    console.log("Checkout session not found");
    context.res.writeHead(302, { location: "/" });
    context.res.end();
  }

  return {
    props: { data: checkoutData },
  };
};

export default Checkout;
