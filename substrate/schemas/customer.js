export default {
  name: "customer",
  title: "Customer",
  type: "document",
  readOnly: true,
  fields: [
    {
      name: "fullName",
      title: "Full Name",
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
      name: "purchases",
      title: "Purchases",
      type: "array",
      of: [
        {
          type: "reference",
          to: { type: "sale" },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "fullName",
    },
  },
};
