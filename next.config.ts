import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
};

export default nextConfig;

// Support for both Cloudflare Workers and Pages
// For Workers: uses @opennextjs/cloudflare in dev
// For Pages: uses native @cloudflare/next-on-pages in build

// Try to load OpenNext configuration for Workers support
try {
	require("@opennextjs/cloudflare").initOpenNextCloudflareForDev?.();
} catch (e) {
	// @opennextjs/cloudflare is optional, pages will use native cloudflare adapter
}
