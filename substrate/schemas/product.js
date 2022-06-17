import { MdOutlineLiquor, MdOutlineSettings } from "react-icons/md";

export default {
  name: "product",
  title: "Product",
  type: "document",
  icon: MdOutlineLiquor,
  groups: [
    {
      name: "general",
      title: "General",
    },
    {
      name: "settings",
      title: "Settings",
      icon: MdOutlineSettings,
    },
  ],
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      group: "general",
      validation: (Rule) => Rule.required().max(50).warning("Shorter titles are usually better"),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "general",
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
      group: "general",
    },
    {
      title: "Colour Variants",
      name: "variants",
      type: "array",
      group: "general",
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
      group: "general",
      validation: (Rule) => Rule.required().warning("You need at least one category"),
      of: [
        {
          type: "reference",
          to: { type: "category" },
        },
      ],
    },
    {
      name: "visible",
      title: "Visible",
      type: "boolean",
      validation: (Rule) => Rule.required(),
      initialValue: false,
      group: "settings",
    },
    {
      name: "checkoutAvailable",
      title: "Checkout Available",
      type: "boolean",
      validation: (Rule) => Rule.required(),
      initialValue: false,
      group: "settings",
    },
  ],

  preview: {
    select: {
      title: "title",
      media: "variants[0].images[0]",
    },
  },
};
