export default {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(50).warning("Shorter titles are usually better"),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      validation: (Rule) => Rule.required().warning("You need a slug to be able to find your product"),
      options: {
        source: "title",
        maxLength: 96,
      },
    },
    {
      name: "body",
      title: "Body",
      type: "localeBlockContent",
    },
    // {
    //   title: "Default Colour Variant",
    //   name: "defaultProductVariant",
    //   type: "productVariant",
    //   validation: (Rule) => Rule.required().warning("You need a default product variant"),
    // },
    {
      title: "Colour Variants",
      name: "variants",
      type: "array",
      of: [
        {
          type: "reference",
          to: { type: "productVariant" },
        },
      ],
    },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      validation: (Rule) => Rule.required().warning("You need at least one category"),
      of: [
        {
          type: "reference",
          to: { type: "category" },
        },
      ],
    },
  ],

  preview: {
    select: {
      title: "title",
      manufactor: "manufactor.title",
      media: "defaultProductVariant.images[0]",
    },
  },
};
