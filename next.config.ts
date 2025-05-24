/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
    serverExternalPackages: [
      "@prisma/client",
      "@auth/prisma-adapter"
      // Anda juga bisa menambahkan paket lain di sini jika menghadapi masalah serupa
    ]
};

export default nextConfig;
