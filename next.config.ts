import type { NextConfig } from "next";

const repo = "clase-b";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? `/${repo}`,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH ?? `/${repo}`,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
