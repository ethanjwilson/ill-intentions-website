import { MdPersonOutline } from "react-icons/md";

export default {
  name: "customer",
  title: "Customer",
  type: "document",
  icon: MdPersonOutline,
  readOnly: true,
  fields: [
    {
      name: "firstName",
      title: "First Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "lastName",
      title: "Last Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      fields: [
        {
          name: "area",
          title: "Region (area)",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "city",
          title: "City",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "code",
          title: "Postal Code (code)",
          type: "number",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "country",
          title: "Country",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "streetAddress",
          title: "Street Address",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
      ],
    },
  ],
  preview: {
    select: {
      firstName: "firstName",
      lastName: "lastName",
      email: "email",
    },
    prepare(selection) {
      const { firstName, lastName, email } = selection;
      return {
        title: `${firstName} ${lastName}`,
        subtitle: email,
      };
    },
  },
};
