import { Grid, GridItem, Box } from "@chakra-ui/react";
import { ReactNode } from "react";

interface CheckoutShellProps {
  children?: ReactNode;
}

const CheckoutShell = ({ children }: CheckoutShellProps) => {
  return (
    <Box minH="100vh" bg="gray.100">
      <Grid py={8} mx="auto" maxW={960} templateColumns="2fr 1fr" gap={8}>
        <GridItem colSpan={1}>{children[0]}</GridItem>
        <GridItem colSpan={1}>{children[1]}</GridItem>
      </Grid>
    </Box>
  );
};

export default CheckoutShell;
