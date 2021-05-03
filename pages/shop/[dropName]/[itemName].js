import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import axios from "axios";
import { db } from "../../../utils/firebaseAdmin";

import { useRouter } from "next/router";

const Item = ({ data: { itemId, name } }) => {
  const router = useRouter();
  const handleCheckout = async () => {
    const { data } = await axios.post("/api/create-payment-intent", { itemId });
    router.push(`/checkout/${data.checkoutId}`);
  };
  return (
    <Box>
      <Stack>
        <Heading>{name}</Heading>
        <Button onClick={handleCheckout}>Go To Checkout</Button>
      </Stack>
      <Stack>
        {/* {items &&
          items.map((item, key) => (
            <Link key={key} href={`${item.id}`}>
              <Box>
                <Text>{item.name}</Text>
              </Box>
            </Link>
          ))} */}
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
