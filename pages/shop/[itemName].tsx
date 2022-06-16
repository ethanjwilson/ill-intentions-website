import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import { Box, Button, Heading, Select, Stack } from "@chakra-ui/react";
import { PortableText } from "@portabletext/react";

import { Sizes } from "../../@types/db";
import LiquidImage from "../../components/LiquidImage";
import { ProductPortableTextComponents } from "../../components/portabletext";
import { client } from "../../utils/sanityClient";

const ItemPage = ({ product }) => {
  console.log(product);
  const [size, setSize] = useState<Sizes | "">("");
  const router = useRouter();
  const handleCheckout = async () => {
    // if (Object.keys(stock).includes(size)) {
    //   const { checkoutId }: { checkoutId: string } = await axios.post("/api/stripe/create-checkout-session", { itemId, size }).then(({ data }) => data);
    //   router.push(`/checkout/${checkoutId}`);
    // }
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
          <LiquidImage images={product.defaultProductVariant.images} name={product.title} />
        </Stack>
        <Stack mt="auto">
          <PortableText value={product.body.en} />
          <Select onChange={({ target }) => setSize(target.value as Sizes)} placeholder="Select Size">
            {Object.entries(product.defaultProductVariant.stock)
              .filter(([_, value]) => value > 0)
              .map(([key, value], idx) => (
                <option key={idx} value={key}>
                  {value > 0 ? `${key.toUpperCase()} - ${value} in stock` : "Not in stock"}
                </option>
              ))}
          </Select>
          <Button onClick={handleCheckout}>Go To Checkout</Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const itemName = context.params.itemName;
  const data = await client.fetch(`*[_type == "product" && slug.current == "${itemName}"]`);

  const product = data[0];

  if (!product) {
    console.log("Product unavailable or not found");
    context.res.writeHead(302, { location: "/" });
    context.res.end();
  }
  return {
    props: { product },
  };
};

export default ItemPage;
