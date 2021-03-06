import { NextPage } from "next";
import NextLink from "next/link";

import { Box, Button, Heading, Link, Stack } from "@chakra-ui/react";

const index: NextPage = () => {
  return (
    <Box>
      <Stack placeItems="center">
        <Stack my={8}>
          <Heading fontSize="7xl" textAlign="center">
            ill intentions
          </Heading>
        </Stack>
        <NextLink passHref href={`/shop`}>
          <Link>
            <Button>Shop</Button>
          </Link>
        </NextLink>
      </Stack>
    </Box>
  );
};

export default index;
