import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_TOKEN;

export const isWriteClientConfigured = Boolean(projectId && token);

export const writeClient = createClient({
  projectId: projectId || "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-04-29",
  useCdn: false,
  token,
});
