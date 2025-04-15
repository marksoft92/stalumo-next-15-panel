import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // Zmieniono na http, ponieważ używasz HTTP dla panel.stalumo.pl
        hostname: "panel.stalumo.pl",
        port: "",
        pathname: "/image-public-uploads/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
