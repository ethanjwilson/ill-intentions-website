import { useNextSanityImage, UseNextSanityImageProps } from "next-sanity-image";
import Image from "next/image";
import NextLink from "next/link";

import { Box, Link, Text } from "@chakra-ui/react";

import { client } from "../utils/sanityClient";

const ProductCard = ({ product }) => {
  const imageProps: UseNextSanityImageProps = useNextSanityImage(client, product.variants[0].images[0]);
  return (
    <Box bg="white" borderRadius="xl">
      <NextLink passHref href={`/shop/${product.slug.current}`}>
        <Link>
          <Box m={4}>
            <Image {...imageProps} priority placeholder="blur" alt={`Picture of ${product.title}`} layout="responsive"></Image>
            <Text textAlign="center" fontSize="lg" fontWeight="semibold">
              {product.title}
            </Text>
          </Box>
        </Link>
      </NextLink>
    </Box>
  );
};

export default ProductCard;
