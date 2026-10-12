# Project Dependencies & Versions

## Project Overview

- **Project Name:** Pla de salut
- **Version:** 0.0.1
- **Type:** ES Module (`type: "module"`)
- **Node Type:** Private

---

## Runtime Dependencies

These are production dependencies required for the application to run.

| Package           | Version     | Purpose                                                               |
| ----------------- | ----------- | --------------------------------------------------------------------- |
| **arquero**       | `^8.0.3`    | Data transformation and manipulation library for JavaScript           |
| **d3**            | `^7.9.0`    | Data visualization library for creating interactive charts and graphs |
| **lucide-svelte** | `^0.554.0`  | Icon library providing Svelte components                              |
| **motion**        | `^12.23.24` | Animation library for smooth motion effects                           |

---

## Development Dependencies

These are dependencies used during development and build processes.

| Package                          | Version    | Purpose                                               |
| -------------------------------- | ---------- | ----------------------------------------------------- |
| **@sveltejs/adapter-auto**       | `^3.0.0`   | Automatic adapter selection for SvelteKit deployments |
| **@sveltejs/kit**                | `2.5.0`    | Modern SvelteKit framework (full-stack)               |
| **@sveltejs/vite-plugin-svelte** | `^3.0.0`   | Vite plugin for Svelte support                        |
| **autoprefixer**                 | `^10.4.16` | PostCSS plugin for vendor prefixing CSS               |
| **flowbite**                     | `^2.2.0`   | Tailwind CSS component library                        |
| **flowbite-svelte**              | `^0.44.20` | Flowbite components as Svelte components              |
| **flowbite-svelte-icons**        | `^1.6.0`   | Icon set for Flowbite Svelte components               |
| **postcss**                      | `^8.4.32`  | CSS transformation tool                               |
| **svelte**                       | `^4.2.7`   | Reactive UI framework                                 |
| **tailwindcss**                  | `^3.3.6`   | Utility-first CSS framework                           |
| **vite**                         | `^5.0.0`   | Modern build tool and dev server                      |

---

## Framework Stack

### Core Framework

- **SvelteKit 2.5.0** - Full-stack web framework based on Svelte
- **Svelte 4.2.7** - Reactive JavaScript framework for building user interfaces

### Build & Development

- **Vite 5.0.0** - Lightning-fast build tool
- **PostCSS 8.4.32** - CSS transformation pipeline
- **Autoprefixer 10.4.16** - Automatic vendor prefixes for CSS

### Styling

- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Flowbite 2.2.0** - Pre-built Tailwind CSS components
- **Flowbite Svelte 0.44.20** - Flowbite components in Svelte
- **Flowbite Svelte Icons 1.6.0** - Icon library integration

### Data & Visualization

- **D3 7.9.0** - Data-driven document manipulation and visualization
- **Arquero 8.0.3** - Data wrangling and analysis library

### UI/UX

- **Lucide Svelte 0.554.0** - Icon components for Svelte
- **Motion 12.23.24** - Animation and motion effects library

---

## Tailwind Configuration

The project uses Tailwind CSS with custom configuration:

### Custom Colors

- **Primary Color Palette:** Custom orange/red tones (primary-50 to primary-900)
  - Primary-500: #FE795D
  - Primary-600: #EF562F
  - Primary-700: #EB4F27

### Custom Fonts

- **Segoe UI** - System font (Segoe UI, Tahoma, sans-serif)
- **Abhaya Libre** - Serif font for typography
- **Inter** - Modern sans-serif font

### Plugins

- **Flowbite Plugin** - Integrates Flowbite components

### Dark Mode

- Supports class-based dark mode (`darkMode: "class"`)

---

## Available Scripts

| Script      | Command                        | Description                                          |
| ----------- | ------------------------------ | ---------------------------------------------------- |
| **dev**     | `vite dev`                     | Start development server with hot module replacement |
| **build**   | `vite build`                   | Build optimized production bundle                    |
| **preview** | `vite preview`                 | Preview production build locally                     |
| **prepare** | `svelte-kit sync \|\| echo ''` | Sync SvelteKit configuration (pre-commit hook)       |

---

## Version Notes

### Caret (^) vs Fixed Versions

- **^** Allows minor and patch updates (e.g., `^4.2.7` allows up to `4.999.999`)
- **Fixed** Locks to exact version (e.g., `2.5.0`)

### Notable Pinned Versions

- **@sveltejs/kit** is pinned to `2.5.0` - ensure compatibility with SvelteKit ecosystem

---

## Environment Support

The project uses `@sveltejs/adapter-auto`, which automatically selects the appropriate deployment adapter based on the environment. Supported environments include:

- Vercel
- Netlify
- Cloudflare Pages
- AWS Lambda
- And many others

See [SvelteKit Adapter Documentation](https://svelte.dev/docs/kit/adapter-auto) for complete list.

---

## Development Requirements

- **Node.js:** Recommended latest LTS version
- **npm:** Latest version (included with Node.js)
- **ES Modules:** Project uses ES module syntax

---

## Installation

```bash
npm install
```

All dependencies will be installed from `package-lock.json` for consistent versions across environments.
