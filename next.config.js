/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

if (process.env.VDRA_TV === 'webos') {
  // WebOS runs basic apps from the file:// protocol at a non-root
  // directory so URLs starting from "/" are pointing to the wrong
  // level of the directory hierarchy. Avoid this by using relative
  // URLs.
  nextConfig.assetPrefix = `file://${process.cwd()}/out`
  nextConfig.basePath = process.cwd() + '/out'
}

module.exports = nextConfig
