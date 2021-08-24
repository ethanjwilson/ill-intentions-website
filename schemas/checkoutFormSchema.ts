import * as yup from "yup";

const checkoutFormSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  isShipped: yup.boolean().required(),
  country: yup.string().when("isShipped", (isShipped: boolean, schema: typeof checkoutFormSchema) => {
    return isShipped ? schema.required() : schema.optional();
  }),
  address: yup.string().when("isShipped", (isShipped: boolean, schema: typeof checkoutFormSchema) => {
    return isShipped ? schema.required() : schema.optional();
  }),
  city: yup.string().when("isShipped", (isShipped: boolean, schema: typeof checkoutFormSchema) => {
    return isShipped ? schema.required() : schema.optional();
  }),
  code: yup.number().when("isShipped", (isShipped: boolean, schema: typeof checkoutFormSchema) => {
    return isShipped ? schema.integer().positive().required() : schema.optional();
  }),
  area: yup.string().when("isShipped", (isShipped: boolean, schema: typeof checkoutFormSchema) => {
    return isShipped ? schema.required() : schema.optional();
  }),
});

export default checkoutFormSchema;
