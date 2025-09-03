# Digiclick AI Website

This repository contains the source code for the Digiclick AI website, a rebranded version of https://www.webnehtech.com/, showcasing AI-powered web and mobile solutions.

## Files
- `index.html`: Main page with hero, services, demo form, features, FAQs, and blog sections.
- `projects.html`: Projects subpage showcasing case studies.
- `style.css`: Custom CSS for hero gradient, animations, and overrides.

## Setup
1. **Clone the Repository**:
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. **Dependencies**:
   - No local installation required. The site uses:
     - Tailwind CSS (via `unpkg.com/tailwindcss@3.4.1/dist/tailwind.min.css`).
     - Montserrat font (via Google Fonts).
   - Ensure `style.css` is in the same directory as `index.html` and `projects.html`.

3. **Local Testing**:
   - Install `live-server` globally:
     ```bash
     npm install -g live-server
     ```
   - Run:
     ```bash
     live-server
     ```
   - Open `http://localhost:8080` in your browser.

4. **Deployment**:
   - Push to GitHub:
     ```bash
     git add .
     git commit -m "Initial commit"
     git push origin main
     ```
   - Deploy to Netlify/Vercel:
     - Create a new site in Netlify/Vercel.
     - Link your GitHub repository.
     - Set the public directory to `/` (root).
     - Deploy, and access via the provided URL.

## Notes
- **Form Backend**: The demo form in `index.html` is not connected. Use Formspree or Netlify Forms for functionality.
- **Assets**: Add images for projects or hero background (e.g., via Unsplash) to match WebnehTech’s visuals.
- **Customization**: Update colors, fonts, or content in `style.css` or HTML files if needed.

## License
&copy; 2025 Digiclick AI. All rights reserved.