// Prisma configuration for Caparison Lab
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use DIRECT_URL (session pooler, port 5432) for migrations
    url: process.env["DIRECT_URL"],
  },
});
