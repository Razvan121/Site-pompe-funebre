/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/index.html',
        permanent: false, // false = 307 Temporary Redirect (good for dev)
      },
    ];
  },
};

export default nextConfig;
