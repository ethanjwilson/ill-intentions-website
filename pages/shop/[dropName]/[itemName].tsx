import { Box, Button, Heading, Select, Stack } from "@chakra-ui/react";
import axios from "axios";
import { db } from "../../../utils/firebaseAdmin";

import { useRouter } from "next/router";
import { useState } from "react";
import { imageLoader } from "../../../utils/imageLoader";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { Item, Sizes } from "../../../@types/db";
import LiquidImage from "../../../components/LiquidImage";

const ItemPage = ({ itemId, name, stock, images }: Item & { itemId: string }) => {
  const [size, setSize] = useState<Sizes | "">("");
  const router = useRouter();
  const handleCheckout = async () => {
    if (Object.keys(stock).includes(size)) {
      const { checkoutId }: { checkoutId: string } = await axios.post("/api/stripe/create-checkout-session", { itemId, size }).then(({ data }) => data);
      router.push(`/checkout/${checkoutId}`);
    }
  };
  return (
    <Box>
      <Stack my="8">
        <Heading textAlign="center" fontSize="8xl">
          {name}
        </Heading>
      </Stack>
      <Stack my={4} maxW={500} mx="auto">
        <LiquidImage images={images} name={name} />
        <Select onChange={({ target }) => setSize(target.value as Sizes)} placeholder="Select Size">
          {Object.keys(stock).map((key: Sizes, idx) => (
            <option key={idx} value={key}>
              {stock[key] > 0 ? `${key.toUpperCase()} - ${stock[key]} in stock` : "Not in stock"}
            </option>
          ))}
        </Select>
        <Button onClick={handleCheckout}>Go To Checkout</Button>
      </Stack>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const itemName = context.params.itemName;
  const data: Item = await db
    .collection("items")
    .where("nameDashified", "==", itemName)
    .get()
    .then((snap) => {
      const tempArray = [];
      snap.forEach((docRef) => {
        const doc = docRef.data();
        doc.itemId = docRef.id;
        tempArray.push(doc);
      });
      return tempArray[0];
    });
  if (!data) {
    console.log("Drop unavailable or not found");
    context.res.writeHead(302, { location: "/" });
    context.res.end();
  }

  delete data.createdAt;

  return {
    props: { ...data },
  };
};

export default ItemPage;
