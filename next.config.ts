import type { NextConfig } from "next";
import path from "path";

const releaseDir = process.env.RELEASE_DIR || process.cwd();
const releaseName = path.basename(releaseDir);

const basePath = `/devtools/global-rates/${releaseName}`;

const nextConfig: NextConfig = {
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;