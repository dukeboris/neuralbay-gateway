/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "export",
  distDir: "build",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ["lucide-react"],
}

module.exports = nextConfig
