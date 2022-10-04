/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // WebOS runs basic apps from the file:// protocol at a non-root
  // directory so URLs starting from "/" are pointing to the wrong
  // level of the directory hierarchy. Avoid this by using relative
  // URLs.
  // assetPrefix: '.'
}

module.exports = nextConfig
