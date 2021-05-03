import * as yup from "yup";

const checkoutFormScheme = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  isShipped: yup.boolean().required(),
  country: yup.string().when("isShipped", (isShipped, schema) => {
    return isShipped ? schema.required() : schema.optional();
  }),
  address: yup.string().when("isShipped", (isShipped, schema) => {
    return isShipped ? schema.required() : schema.optional();
  }),
  suburb: yup.string().when("isShipped", (isShipped, schema) => {
    return isShipped ? schema.required() : schema.optional();
  }),
  postcode: yup.number().when("isShipped", (isShipped, schema) => {
    return isShipped ? schema.integer().positive().required() : schema.optional();
  }),
});

export default checkoutFormScheme;
