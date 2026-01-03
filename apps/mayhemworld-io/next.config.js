/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'localhost'],
  },
  env: {
    NEXT_PUBLIC_SITE_UID: 'mayhemworld-io',
  },
  transpilePackages: ['strapi-sdk'],
};

module.exports = nextConfig;
