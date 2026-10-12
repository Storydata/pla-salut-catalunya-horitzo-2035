import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    // A GitHub Pages el projecte es serveix sota /<nom-del-repositori>/. El
    // workflow (.github/workflows/deploy.yml) hi posa BASE_PATH; en local i a
    // Vercel queda buit i tot continua penjant de l'arrel.
    paths: {
      base: process.argv.includes("dev") ? "" : (process.env.BASE_PATH ?? ""),
    },
  },
};

export default config;
