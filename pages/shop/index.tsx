import { GetStaticProps } from "next";

import { Grid, Heading, Stack } from "@chakra-ui/react";

import ProductCard from "../../components/ProductCard";
import { client } from "../../utils/sanityClient";

const Shop = ({ data }) => {
  return (
    <Stack px={8} bg="gray.100" minH="100vh">
      <Stack my="8">
        <Heading textAlign="center" fontSize="6xl">
          Shop
        </Heading>
      </Stack>
      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" py={4} gap={4}>
        {data.map((product, key) => (
          <ProductCard product={product} key={key} />
        ))}
      </Grid>
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  let data = await client.fetch(`*[_type == "product"]{
    ...,
    variants[]->,
  }`);
  return {
    props: { data },
    revalidate: 10,
  };
};

export default Shop;
