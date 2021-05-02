import { Box, Button, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";

const index = () => {
  return (
    <Box>
      <Heading>Ill Intentions</Heading>
      <NextLink passHref href={`/shop/HIbrGSd9r7FmwkO6Hg2w`}>
        <Link>
          <Button>Vengance</Button>
        </Link>
      </NextLink>
    </Box>
  );
};

export default index;
