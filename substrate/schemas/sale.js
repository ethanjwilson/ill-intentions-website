export default {
  name: "sale",
  title: "Sale",
  type: "document",
  readOnly: true,
  fields: [
    {
      name: "clientSecret",
      title: "Client Secret",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "paymentIntentId",
      title: "Payment Intent ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "completed",
      title: "Completed",
      type: "boolean",
      validation: (Rule) => Rule.required(),
      initialValue: false,
    },
    {
      name: "customer",
      title: "Customer",
      type: "reference",
      to: { type: "customer" },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "product",
      title: "Product",
      type: "reference",
      to: { type: "product" },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "salePrice",
      title: "Sale Price",
      type: "number",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "salePriceSet",
      title: "Sale Price Set",
      type: "boolean",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "productVariant",
      title: "Product Variant",
      type: "reference",
      to: { type: "productVariant" },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "size",
      title: "Size",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: "completed",
    },
  },
};
