import axios from "axios";
import useSWR from "swr";
import NextLink from "next/link";
import { Box, Button, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { db } from "../../../utils/firebaseAdmin";

const fetcher = (url, dropId) => axios.post(url, { dropId }).then((res) => res.data);

const Shop = ({ data: { dropId, name: dropName } }) => {
  const { data: items } = useSWR(["/api/getDropItems", dropId], fetcher);
  return (
    <Box>
      <Stack>
        <Heading>{dropName}</Heading>
      </Stack>
      <Stack>
        {items &&
          items.map((item, key) => (
            <NextLink passHref key={key} href={`${dropId}/${item.id}`}>
              <Link>
                <Box>
                  <Text>{item.name}</Text>
                </Box>
              </Link>
            </NextLink>
          ))}
      </Stack>
    </Box>
  );
};

export const getServerSideProps = async (context) => {
  const dropId = context.params.dropId;
  const data = await db
    .collection("drops")
    .doc(dropId)
    .get()
    .then((doc) => doc.data());
  if (!data || !data.available) {
    console.log("Drop unavailable or not found");
    context.res.writeHead(302, { location: "/" });
    context.res.end();
  }

  delete data.createdAt;
  delete data.startAt;
  delete data.available;

  return {
    props: { data: { ...data, dropId } },
  };
};

export default Shop;
