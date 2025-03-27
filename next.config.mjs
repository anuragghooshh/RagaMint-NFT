/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "gateway.pinata.cloud",
      "ipfs.io",
      "gateway.ipfs.io",
      "cloudflare-ipfs.com",
      "infura-ipfs.io",
    ],
  },
  // If you're also using IPFS metadata URLs in your app, add this:
  async rewrites() {
    return [
      {
        source: "/ipfs/:path*",
        destination: "https://gateway.pinata.cloud/ipfs/:path*",
      },
    ];
  },
};

export default nextConfig;
