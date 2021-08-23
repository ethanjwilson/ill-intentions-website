import { Box, Button, Heading, Link, Stack } from "@chakra-ui/react";
import { NextPage } from "next";
import NextLink from "next/link";

const index: NextPage = () => {
  return (
    <Box>
      <Stack placeItems="center">
        <Stack my={8}>
          <Heading fontSize="8xl" textAlign="center">
            ill intentions
          </Heading>
        </Stack>
        <NextLink passHref href={`/shop/vengeance`}>
          <Link>
            <Button>Vengeance</Button>
          </Link>
        </NextLink>
      </Stack>
    </Box>
  );
};

export default index;
