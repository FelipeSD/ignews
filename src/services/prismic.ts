import * as prismic from "@prismicio/client";

export function getPrismicClient(req?: any) {
  return prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });
}
