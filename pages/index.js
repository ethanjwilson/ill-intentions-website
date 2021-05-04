import { Box, Button, Heading, Link, Stack } from "@chakra-ui/react";
import NextLink from "next/link";

const index = () => {
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
