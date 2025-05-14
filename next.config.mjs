/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/embed",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://waitlist-376.created.app",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
