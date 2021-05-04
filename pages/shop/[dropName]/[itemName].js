import { Box, Button, Heading, Select, Stack } from "@chakra-ui/react";
import axios from "axios";
import { db } from "../../../utils/firebaseAdmin";

import { useRouter } from "next/router";
import { useState } from "react";
import { imageLoader } from "../../../utils/imageLoader";
import Image from "next/image";

const Item = ({ data: { itemId, name, stock, images } }) => {
  const [size, setSize] = useState("");
  const router = useRouter();
  const handleCheckout = async () => {
    if (Object.keys(stock).includes(size)) {
      const { data } = await axios.post("/api/stripe/create-checkout-session", { itemId, size });
      router.push(`/checkout/${data.checkoutId}`);
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
        <Image priority loader={imageLoader} src={`${images[0]}.webp`} alt={`Picture of ${name}`} width={500} height={500} />
        <Select onChange={({ target }) => setSize(target.value)} placeholder="Select Size">
          {Object.keys(stock).map((key, idx) => (
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

export const getServerSideProps = async (context) => {
  const itemName = context.params.itemName;
  const data = await db
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
  // delete data.startAt;
  // delete data.available;

  return {
    props: { data },
  };
};

export default Item;
