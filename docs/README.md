# Doccident Documentation Website

This directory contains the source code for the Doccident documentation website, built with React and Vite.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The documentation site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. See `.github/workflows/deploy-docs.yml` for the deployment configuration.

## Structure

- `src/App.jsx` - Main application component with all site content
- `src/main.jsx` - React entry point
- `src/index.css` - Global styles
- `index.html` - HTML entry point
- `vite.config.js` - Vite configuration

## Technology Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **CSS** - Custom styling (no framework)
- Fonts: Outfit (body), IBM Plex Mono (code)
