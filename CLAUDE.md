# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Jules Udahemuka, an AI researcher and engineer. The site showcases his research, projects, skills, and academic background. It's a static HTML/CSS/JavaScript website designed to be deployed on GitHub Pages.

## Architecture

The portfolio is built as a single-page application with the following structure:

- **`index.html`** - Main portfolio page with all sections (about, skills, projects, reading list)
- **`monitormed-ai.html`** - Dedicated page for MonitorMed AI project
- **`assets/css/stylesheet.css`** - All styling for the portfolio
- **`js/main.js`** - JavaScript for project filtering and navigation functionality
- **`script.js`** - Additional JavaScript for sticky navigation and project filtering
- **`assets/`** - Static assets directory containing:
  - `icons/` - Skill icons and logos
  - `documents/` - PDFs, research papers, and resume files
  - `images/` - Project images and visual assets

## Key Features

1. **Sticky Navigation** - Navigation bar becomes sticky on scroll
2. **Project Filtering** - Interactive filtering for research projects and work
3. **Responsive Design** - Mobile-friendly layout
4. **GitHub Activity Integration** - Live GitHub contribution chart
5. **Document Hosting** - PDFs and research papers served directly from the repo

## Development Commands

This is a static website with no build process. Files are served directly:

- **Local Development**: Open `index.html` in a browser or use a local server:
  ```bash
  python -m http.server 8000
  # or
  npx serve .
  ```

- **Deployment**: The site is automatically deployed via GitHub Pages from the `main` branch

## Content Management

- **Resume**: Update `assets/documents/resume/jules_udahemuka_resume.pdf`
- **Research Papers**: Add to `assets/documents/research-and-projects/`
- **Reading List**: Update the "Now Reading" section in `index.html`
- **Projects**: Add new project cards to the `#projects` section in `index.html`
- **Skills**: Update skill icons in `assets/icons/` and skill list in `index.html`

## External Dependencies

- **Google Analytics**: Integrated for tracking (ID: G-237Q651Z2Z)
- **GitHub Chart**: Live contribution chart from `ghchart.rshah.org`
- **Social Media Icons**: Inline SVG icons for Twitter, LinkedIn, GitHub

## SEO and Meta Tags

The site includes comprehensive meta tags for:
- Open Graph (social media sharing)
- Twitter Cards
- Search engine optimization
- Favicon and branding

## Important Notes

- All JavaScript functionality is vanilla JS (no frameworks)
- The site uses semantic HTML and is accessibility-friendly
- Images should be optimized for web before adding
- PDF documents are served directly from the repository
- The site is optimized for GitHub Pages deployment constraints