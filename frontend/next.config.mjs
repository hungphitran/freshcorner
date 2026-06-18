/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'down-vn.img.susercontent.com', 'imgur.com', 'i.imgur.com', 'afifilter.com.vn'],
  },
  eslint: {
    // Skip ESLint during production builds to prevent build failures due to lint errors
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    const configured = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
    const backend =
      process.env.NODE_ENV === 'development' &&
      !configured
        ? 'http://localhost:5000/api'
        : configured || '/api';
    return [
      {
        source: '/api/:path*',
        destination: `${backend}/:path*`,
      },
    ];
  },
};

export default nextConfig;
