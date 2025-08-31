/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false, // desativa SWC
  compiler: {
    // força uso do compilador alternativo
  }
}

module.exports = nextConfig