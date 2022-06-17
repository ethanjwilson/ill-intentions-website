export default {
  title: "Product Variant",
  name: "productVariant",
  type: "document",
  groups: [
    {
      title: "General",
      name: "general",
      default: true,
    },
    {
      name: "erp",
      title: "ERP",
    },
  ],
  fields: [
    {
      title: "Price (in Cents)",
      name: "price",
      type: "number",
      validation: (Rule) => Rule.greaterThan(99).required("You need a price").positive("Price cannot be negative").integer("Price must be an integer and in cents"),
      group: "erp",
    },
    {
      title: "Colour",
      name: "color",
      type: "object",
      group: "general",
      fields: [
        {
          title: "Colour Title",
          name: "colorTitle",
          type: "string",
          validation: (Rule) => Rule.required().max(50).warning("Shorter titles are usually better"),
        },
        {
          name: "color",
          title: "Colour",
          type: "color",
          validation: (Rule) => Rule.required().warning("You need a colour"),
          options: {
            disableAlpha: true,
          },
        },
      ],
    },
    {
      title: "Stock",
      name: "stock",
      type: "object",
      group: "erp",
      fields: [
        {
          title: "Small",
          name: "small",
          type: "number",
          validation: (Rule) => Rule.required("You need a stock value").positive("Stock cannot be negative").integer("Stock must be an integer"),
        },
        {
          title: "Medium",
          name: "medium",
          type: "number",
          validation: (Rule) => Rule.required("You need a stock value").positive("Stock cannot be negative").integer("Stock must be an integer"),
        },
        {
          title: "Large",
          name: "large",
          type: "number",
          validation: (Rule) => Rule.required("You need a stock value").positive("Stock cannot be negative").integer("Stock must be an integer"),
        },
      ],
    },
    {
      title: "SKU",
      name: "sku",
      type: "string",
      group: "erp",
    },
    {
      title: "Taxable",
      name: "taxable",
      type: "boolean",
      group: "erp",
      initialValue: true,
    },
    {
      name: "images",
      title: "Images",
      type: "array",
      group: "general",
      validation: (Rule) => Rule.required("You need at least one image").warning("You need at least one image"),
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
    },
  ],
};
