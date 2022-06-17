import NextLink from "next/link";

import { Link, ListItem, Text, UnorderedList } from "@chakra-ui/react";

export const ProductPortableTextComponents = {
  block: {
    normal: ({ children, value }) => {
      return <Text>{children}</Text>;
    },
    h2: ({ children, value }) => {
      return <Text fontSize="4xl">{children}</Text>;
    },
    h3: ({ children, value }) => {
      return <Text fontSize="2xl">{children}</Text>;
    },
    h4: ({ children, value }) => {
      return <Text fontSize="xl">{children}</Text>;
    },
  },
  list: {
    // Ex. 1: customizing common list types
    bullet: ({ children }) => <UnorderedList spacing={2}>{children}</UnorderedList>,

    // number: ({ children }) => < className="mt-lg">{children}</>,

    // Ex. 2: rendering custom lists
    // checkmarks: ({ children }) => <ol className="m-auto text-lg">{children}</ol>,
  },

  listItem: {
    // Ex. 1: customizing common list types
    bullet: ({ children }) => <ListItem>{children}</ListItem>,

    // Ex. 2: rendering custom list items
    // checkmarks: ({ children }) => <li>✅ {children}</li>,
  },

  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined;
      return (
        <NextLink href={value.href} passHref>
          <Link color="blue" rel={rel}>
            {children}
          </Link>
        </NextLink>
      );
    },
    strong: ({ children, value }) => (
      <Text as="span" fontWeight="bold">
        {children}
      </Text>
    ),
    em: ({ children, value }) => <Text as="em">{children}</Text>,
  },
};
