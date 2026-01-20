# Doccident Website Setup

The Doccident documentation website has been successfully created, following the same approach as the Protokoll website.

## What Was Created

### Documentation Site (`/docs`)

```
docs/
├── src/
│   ├── App.jsx          # Main React component with all content
│   ├── main.jsx         # React entry point
│   └── index.css        # Custom styles
├── index.html           # HTML entry point
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── .gitignore          # Git ignore rules
├── .npmrc              # NPM configuration
└── README.md           # Documentation
```

### GitHub Workflow

Created `.github/workflows/deploy-docs.yml` which:
- Triggers on push to `main` branch
- Builds the main library
- Installs and builds the documentation site
- Deploys to GitHub Pages

## Features of the Website

The website showcases:

1. **Hero Section** - Introduction to Doccident with clear value proposition
2. **Problem Statement** - Three key problems Doccident solves
3. **Before/After Comparison** - Visual demonstration of the benefits
4. **Language Support** - 14+ supported languages with visual grid
5. **Key Features** - Six main features with explanations
6. **Output Verification Demo** - Code example showing output testing
7. **Snapshot Updates** - Explanation of auto-update feature
8. **Configuration** - Example `.doccident-setup.js` configuration
9. **CI Integration** - How to use in CI/CD pipelines
10. **Quick Start** - 3-step installation guide
11. **Real-World Example** - Terminal demo showing Doccident testing itself
12. **Call to Action** - Links to NPM and GitHub

## Design

- **Color Scheme**: Blue primary (#3b82f6), amber accent (#f59e0b)
- **Typography**: Outfit (body), IBM Plex Mono (code)
- **Dark Mode**: Default with light mode media query support
- **Responsive**: Mobile-friendly breakpoints

## Deployment

### GitHub Pages Setup

1. Enable GitHub Pages in repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions
   - The workflow will automatically deploy on push to main

2. Update repository settings if needed:
   - The base path is set to `/doccident/` in `vite.config.js`
   - Website will be available at: `https://verifikasjon.github.io/doccident/`

### Local Development

```bash
cd docs

# Install dependencies
npm install

# Run dev server (localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Next Steps

1. **Push to GitHub**: Commit and push these changes to trigger the deployment
2. **Enable GitHub Pages**: Configure in repository settings
3. **Custom Domain** (optional): Add a CNAME file to `docs/public/` if desired
4. **Update README**: Add a link to the website in the main README.md

## Differences from Protokoll

While the structure and approach are identical, the content has been adapted to focus on Doccident's features:

- Documentation testing (vs. transcription)
- Multi-language support (vs. name correction)
- Output verification (vs. routing)
- Snapshot updates (vs. interactive mode)
- Configuration options (vs. context system)

## Build Output

The build successfully generates:
- `dist/index.html` - Main page
- `dist/404.html` - 404 page (copy of index for SPA routing)
- `dist/assets/` - Minified JS and CSS bundles

Build is optimized with:
- Code splitting disabled (single bundle for simplicity)
- Asset minification and gzip
- Production React build

## Maintenance

To update the website:

1. Edit `docs/src/App.jsx` for content changes
2. Edit `docs/src/index.css` for styling changes
3. Commit and push to main branch
4. GitHub Actions will automatically rebuild and deploy

The workflow takes approximately 2-3 minutes to complete.
