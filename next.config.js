/**
 * @type {import('next').NextConfig}
 */

const webpack = require("webpack");

module.exports = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [
      "public.blob.vercel-storage.com",
      "res.cloudinary.com",
      "abs.twimg.com",
      "pbs.twimg.com",
      "avatars.githubusercontent.com",
      "www.google.com",
      "flag.vercel.app",
      "illustrations.popsy.co",
    ],
  },
  reactStrictMode: false,
  webpack: (config, options) => {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      }),
    );
    return config;
  },
};
