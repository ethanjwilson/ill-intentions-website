import { useFormContext } from "react-hook-form";
import { Stack, Heading, Switch, Text, Select } from "@chakra-ui/react";

const DeliveryDetailForm = () => {
  const { register, watch } = useFormContext();
  const isShipped = watch("isShipped");
  return (
    <Stack bg="white" spacing={4} p={4} borderRadius="lg">
      <Heading fontSize="xl" my={2}>
        Delivery Details
      </Heading>
      <Stack direction="row">
        <Stack spacing={4} flex={1} direction="row">
          <Text fontSize="lg" fontWeight="semibold" color={isShipped ? "gray.300" : "black"}>
            Pick up
          </Text>
          <Switch size="lg" {...register("isShipped")} />
          <Text fontSize="lg" fontWeight="semibold" color={!isShipped ? "gray.300" : "black"}>
            Ship it to me
          </Text>
        </Stack>
        <Stack flex={1}>
          <Select {...register("country")} placeholder="Select Country">
            <option value="NZ">New Zealand</option>
            <option value="JAP">Japan</option>
            <option value="US">United States</option>
          </Select>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DeliveryDetailForm;
