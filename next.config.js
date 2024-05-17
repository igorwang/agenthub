/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    HTTP_API_HOST: process.env.HTTP_API_HOST,
    WS_API_HOST: process.env.WS_API_HOST,
    APP_HOST:process.env.APP_HOST
  },
};

module.exports = nextConfig;