import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  dynamicParams: true,
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
