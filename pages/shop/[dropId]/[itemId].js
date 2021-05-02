import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { db } from "../../../utils/firebaseAdmin";

const Item = ({ data }) => {
  return (
    <Box>
      <Stack>
        <Heading>{data.name}</Heading>
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
  const itemId = context.params.itemId;
  const data = await db
    .collection("items")
    .doc(itemId)
    .get()
    .then((doc) => doc.data());
  if (!data) {
    console.log("Drop unavailable or not found");
    context.res.writeHead(302, { location: "/" });
    context.res.end();
  }

  delete data.createdAt;
  // delete data.startAt;
  // delete data.available;

  return {
    props: { data: { ...data, itemId } },
  };
};

export default Item;
