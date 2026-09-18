import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Šírky pre mockupy (hero 1272 px, dashboard 1272 px, telefóny 320 px)
    deviceSizes: [390, 640, 768, 1024, 1280, 1440, 1920, 2560],
    imageSizes: [240, 320, 480, 640],
  },
};

export default nextConfig;
