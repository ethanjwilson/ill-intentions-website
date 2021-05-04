import { useFormContext } from "react-hook-form";
import { Stack, Heading, Switch, Text, Select } from "@chakra-ui/react";

const DeliveryForm = () => {
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
            <option value="nz">New Zealand</option>
            <option value="aus">Australia</option>
          </Select>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DeliveryForm;
