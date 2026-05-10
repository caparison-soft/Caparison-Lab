/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'caparison-lab.vercel.app',
          },
        ],
        destination: 'https://www.caparisonlab.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
