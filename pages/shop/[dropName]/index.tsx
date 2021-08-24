import axios from "axios";
import useSWR from "swr";
import NextLink from "next/link";
import Image from "next/image";
import { Box, Grid, Heading, Link, Skeleton, Stack, Text } from "@chakra-ui/react";
import { db } from "../../../utils/firebaseAdmin";
import { imageLoader } from "../../../utils/imageLoader";
import { Item } from "../../../@types/db";
import { GetServerSideProps } from "next";

const fetcher = (url: string, dropId: string) => axios.post(url, { dropId }).then(({ data }) => data as Item[]);

const Shop = ({ data: dropData }) => {
  const { dropId, nameDashified } = dropData;
  const { data: items } = useSWR(["/api/getDropItems", dropId], fetcher);

  return (
    <Box maxW={1080} mx="auto">
      <Stack my="8">
        <Heading textAlign="center" fontSize="8xl">
          {dropData.name}
        </Heading>
      </Stack>
      <Grid templateColumns="repeat(3, 1fr)" my={4} mx="auto" gap={4}>
        {items ? (
          items.map((item, key) => (
            <NextLink passHref key={key} href={`${nameDashified}/${item.nameDashified}`}>
              <Link>
                <Box>
                  <Image priority loader={imageLoader} src={`${item.images[0]}.webp`} alt={`Picture of ${item.name}`} width={500} height={500}></Image>
                  <Text textAlign="center" fontSize="lg" fontWeight="semibold">
                    {item.name}
                  </Text>
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
      </Grid>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
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
