import axios from "axios";
import useSWR from "swr";
import NextLink from "next/link";
import { Box, Heading, Link, Skeleton, Stack, Text } from "@chakra-ui/react";
import { db } from "../../../utils/firebaseAdmin";

const fetcher = (url, dropId) => axios.post(url, { dropId }).then(({ data }) => data);

const Shop = ({ data: dropData }) => {
  const { dropId, nameDashified } = dropData;
  const { data: items } = useSWR(["/api/getDropItems", dropId], fetcher);

  return (
    <Box>
      <Stack>
        <Heading>{dropData.name}</Heading>
      </Stack>
      <Stack>
        {items ? (
          items.map((item, key) => (
            <NextLink passHref key={key} href={`${nameDashified}/${item.nameDashified}`}>
              <Link>
                <Box>
                  <Text>{item.name}</Text>
                </Box>
              </Link>
            </NextLink>
          ))
        ) : (
          <>
            <Skeleton h={4} />
            <Skeleton h={4} />
            <Skeleton h={4} />
          </>
        )}
      </Stack>
    </Box>
  );
};

export const getServerSideProps = async (context) => {
  const dropName = context.params.dropName;
  const data = await db
    .collection("drops")
    .where("nameDashified", "==", dropName)
    .get()
    .then((snap) => {
      const tempArray = [];
      snap.forEach((docRef) => {
        const doc = docRef.data();
        doc.dropId = docRef.id;
        tempArray.push(doc);
      });
      return tempArray[0];
    });
  if (!data || !data.available) {
    console.log("Drop unavailable or not found");
    context.res.writeHead(302, { location: "/" });
    context.res.end();
  }

  delete data.createdAt;
  delete data.startAt;
  delete data.available;

  return {
    props: { data: { ...data } },
  };
};

export default Shop;
