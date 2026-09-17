import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Le driver MongoDB embarque des dépendances optionnelles natives que le
  // bundler serveur ne doit pas essayer d'inliner.
  serverExternalPackages: ["mongodb"],
};

export default nextConfig;
