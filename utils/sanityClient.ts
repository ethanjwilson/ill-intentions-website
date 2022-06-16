import sanityClient from "@sanity/client";

export const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_ID,
  dataset: "production",
  apiVersion: "2022-06-16",
  token: process.env.SANITY_TOKEN,
  useCdn: true,
});
