import { useFormContext } from "react-hook-form";

import { Heading, Select, Stack, Switch, Text } from "@chakra-ui/react";

interface DeliveryFormProps {
  disabled: boolean;
}

const DeliveryForm = ({ disabled }: DeliveryFormProps) => {
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
          <Switch disabled={disabled} size="lg" {...register("isShipped")} />
          <Text fontSize="lg" fontWeight="semibold" color={!isShipped ? "gray.300" : "black"}>
            Ship it to me
          </Text>
        </Stack>
        <Stack flex={1}>
          <Select disabled={!isShipped || disabled} {...register("country")} defaultValue="">
            <option disabled value="">
              Select Country
            </option>
            <option value="nzl">New Zealand</option>
            {/* <option value="aus">Australia</option> */}
          </Select>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DeliveryForm;
