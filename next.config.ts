import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'biiibo.com',
      'drive.google.com',
      'd3q01gc7kwv7n6.cloudfront.net',
      'iqvinc.com',
      'www.biiibo.com',
      'khogachre.vn',
    ],
  },
  //htt
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard/revenue',
        permanent: true,
      },
      {
        source: '/manager/warehouse',
        destination: '/manager/warehouse/instock',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
