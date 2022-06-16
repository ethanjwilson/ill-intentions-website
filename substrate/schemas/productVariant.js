export default {
  title: "Product variant",
  name: "productVariant",
  type: "object",
  groups: [
    {
      title: "General",
      name: "general",
    },
    {
      name: "erp",
      title: "ERP",
    },
  ],
  fields: [
    {
      title: "Title",
      name: "title",
      type: "string",
      group: "general",
    },
    {
      title: "Price",
      name: "price",
      type: "number",
      group: "erp",
    },
    {
      title: "Colour",
      name: "color",
      type: "string",
      group: "general",
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
        },
        {
          title: "Medium",
          name: "medium",
          type: "number",
        },
        {
          title: "Large",
          name: "large",
          type: "number",
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
    },
    {
      name: "images",
      title: "Images",
      type: "array",
      group: "general",
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
