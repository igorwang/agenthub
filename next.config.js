const envFile =
  process.env.NODE_ENV === "production" ? ".env.production.local" : ".env.local";
require("dotenv").config({ path: envFile });
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");
const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin();

const envConfig = dotenv.parse(fs.readFileSync(envFile));

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure that all imports of 'yjs' resolve to the same instance
      config.resolve.alias["yjs"] = path.resolve(__dirname, "node_modules/yjs");
    }
    return config;
  },
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/chat",
        permanent: true,
      },
    ];
  },
  env: envConfig,
  // env: {
  //   HTTP_API_HOST: process.env.HTTP_API_HOST,
  //   WS_API_HOST: process.env.WS_API_HOST,
  //   APP_HOST: process.env.APP_HOST,
  // },
};

module.exports = withNextIntl(nextConfig);
