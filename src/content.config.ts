import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("VT Dispensary Directory"),
    draft: z.boolean().default(false),
  }),
});

const strains = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/strains" }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    type: z.enum(["indica", "sativa", "hybrid"]),
    lineage: z.string().optional(),
    thc: z.string().optional(),
    cbd: z.string().optional(),
    terpenes: z.array(z.string()).default([]),
    effects: z.array(z.string()).default([]),
    flavors: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { news, strains };
