import { useFormContext } from "react-hook-form";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Input, InputRightElement, InputGroup, Stack, Heading, Select } from "@chakra-ui/react";
import dashify from "dashify";

const ShippingShellForm = ({ addressPlaceholder, cityPlaceholder, codePlaceholder, areaPlaceholder, areaOptions, disabled }) => {
  const {
    register,
    formState: { errors, touchedFields },
  } = useFormContext();

  return (
    <Stack bg="white" spacing={4} p={4} borderRadius="lg">
      <Heading fontSize="xl" my={2}>
        Shipping Details
      </Heading>

      <InputGroup>
        {/* <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em" children="$" /> */}
        <Input placeholder={addressPlaceholder} {...register("address")} disabled={disabled} />
        {touchedFields.address && <InputRightElement children={!!errors.address ? <CloseIcon color="red.500" /> : <CheckIcon color="green.500" />} />}
      </InputGroup>
      <Stack direction="row">
        <InputGroup>
          {/* <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em" children="$" /> */}
          <Input placeholder={cityPlaceholder} {...register("city")} disabled={disabled} />
          {touchedFields.city && <InputRightElement children={!!errors.city ? <CloseIcon color="red.500" /> : <CheckIcon color="green.500" />} />}
        </InputGroup>
        <InputGroup>
          {/* <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em" children="$" /> */}
          <Input placeholder={codePlaceholder} {...register("code")} disabled={disabled} />
          {touchedFields.code && <InputRightElement children={!!errors.code ? <CloseIcon color="red.500" /> : <CheckIcon color="green.500" />} />}
        </InputGroup>
      </Stack>
      <Stack flex={1}>
        <Select {...register("area")} placeholder={areaPlaceholder} disabled={disabled}>
          {areaOptions.map(({ name, value }) => (
            <option key={name} value={value ? value : dashify(name)}>
              {name}
            </option>
          ))}
        </Select>
      </Stack>
    </Stack>
  );
};

export default ShippingShellForm;
