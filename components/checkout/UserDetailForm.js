import { useFormContext } from "react-hook-form";
import { Input, InputRightElement, InputLeftElement, InputGroup, Stack, Heading } from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

const UserDetailForm = () => {
  const {
    register,
    formState: { errors, touchedFields },
  } = useFormContext();
  return (
    <Stack bg="white" spacing={4} p={4} borderRadius="lg">
      <Heading fontSize="xl" my={2}>
        Customer Details
      </Heading>
      <Stack direction="row">
        <InputGroup>
          {/* <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em" children="$" /> */}
          <Input placeholder="First Name" {...register("firstName")} />
          {touchedFields.firstName && <InputRightElement children={!!errors.firstName ? <CloseIcon color="red.500" /> : <CheckIcon color="green.500" />} />}
        </InputGroup>
        <InputGroup>
          {/* <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em" children="$" /> */}
          <Input placeholder="Last Name" {...register("lastName")} />
          {touchedFields.lastName && <InputRightElement children={!!errors.lastName ? <CloseIcon color="red.500" /> : <CheckIcon color="green.500" />} />}
        </InputGroup>
      </Stack>
      <InputGroup>
        {/* <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em" children="$" /> */}
        <Input placeholder="Email" {...register("email")} />
        {touchedFields.email && <InputRightElement children={!!errors.email ? <CloseIcon color="red.500" /> : <CheckIcon color="green.500" />} />}
      </InputGroup>
    </Stack>
  );
};

export default UserDetailForm;
