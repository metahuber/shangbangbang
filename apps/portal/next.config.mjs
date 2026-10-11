/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Docker 部署用：只打包运行时真正需要的文件，镜像小很多
  output: "standalone",
};

export default nextConfig;
