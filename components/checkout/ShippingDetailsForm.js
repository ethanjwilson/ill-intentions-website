import { useFormContext } from "react-hook-form";
import { Input, InputRightElement, InputGroup, Stack, Heading } from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useEffect } from "react";

const ShippingDetailsForm = () => {
  const {
    register,
    unregister,
    formState: { errors, touchedFields },
    watch,
  } = useFormContext();

  const showShipping = watch("isShipped");

  useEffect(() => {
    if (!showShipping) {
      unregister(["address", "suburb", "postcode"]);
    }
  }, [showShipping]);

  return showShipping ? (
    <Stack bg="white" spacing={4} p={4} borderRadius="lg">
      <Heading fontSize="xl" my={2}>
        Shipping Details
      </Heading>

      <InputGroup>
        {/* <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em" children="$" /> */}
        <Input placeholder="Address" {...register("address")} />
        {touchedFields.address && <InputRightElement children={!!errors.address ? <CloseIcon color="red.500" /> : <CheckIcon color="green.500" />} />}
      </InputGroup>
      <Stack direction="row">
        <InputGroup>
          {/* <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em" children="$" /> */}
          <Input placeholder="Suburb" {...register("suburb")} />
          {touchedFields.suburb && <InputRightElement children={!!errors.suburb ? <CloseIcon color="red.500" /> : <CheckIcon color="green.500" />} />}
        </InputGroup>
        <InputGroup>
          {/* <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em" children="$" /> */}
          <Input placeholder="Post Code" {...register("postcode")} />
          {touchedFields.postcode && <InputRightElement children={!!errors.lastName ? <CloseIcon color="red.500" /> : <CheckIcon color="green.500" />} />}
        </InputGroup>
      </Stack>
    </Stack>
  ) : null;
};

export default ShippingDetailsForm;
