import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import { Box, Button, Heading, Select, Stack, Text } from "@chakra-ui/react";
import { PortableText } from "@portabletext/react";

import { Sizes } from "../../@types/db";
import LiquidImage from "../../components/LiquidImage";
import { ProductPortableTextComponents } from "../../components/ProductPortableTextComponents";
import { client } from "../../utils/sanityClient";

const ItemPage = ({ product }) => {
  const [size, setSize] = useState<Sizes | "">("");
  const [variant, setVariant] = useState(product.variants[0]);
  const router = useRouter();
  const handleCheckout = async () => {
    if (product.checkoutAvailable && Object.keys(variant.stock).includes(size)) {
      const { checkoutId }: { checkoutId: string } = await axios
        .post("/api/stripe/create-checkout-session", { productId: product._id, productVariantId: variant._id, size })
        .then(({ data }) => data);
      router.push(`/checkout/${checkoutId}`);
    }
  };

  return (
    <Box>
      <Stack my={8}>
        <Heading textAlign="center" fontSize="8xl">
          {product.title}
        </Heading>
      </Stack>
      <Stack spacing={16} direction="row" mx="auto" justify="center">
        <Stack maxW={500}>
          <LiquidImage images={variant.images} name={product.title} />
        </Stack>
        <Stack spacing={4} mt="auto">
          {/* @ts-ignore */}
          <PortableText value={product.body.en} components={ProductPortableTextComponents} />
          {!product.checkoutAvailable && (
            <Text fontWeight="bold" color="gray.600">
              Checkout is currently unavailable. Please try again later.
            </Text>
          )}
          <Select disabled={!product.checkoutAvailable} onChange={({ target }) => setSize(target.value as Sizes)} placeholder="Select Size">
            {Object.entries(variant.stock)
              .filter(([_, value]) => value > 0)
              .map(([key, value], idx) => (
                <option key={idx} value={key}>
                  {value > 0 ? `${key.toUpperCase()} - ${value} in stock` : "Not in stock"}
                </option>
              ))}
          </Select>
          <Button disabled={!product.checkoutAvailable} onClick={handleCheckout}>
            Go To Checkout
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const itemName = context.params.itemName;
  const data = await client.fetch(`*[_type == "product" && slug.current == "${itemName}"] { 
    ...,
    variants[]->
   }`);

  const product = data[0];

  if (!product || (product && !product.visible)) {
    console.log("Product unavailable or not found");
    context.res.writeHead(302, { location: "/" });
    context.res.end();
  }
  return {
    props: { product },
  };
};

export default ItemPage;
