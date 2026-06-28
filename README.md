# Walkthrough - First Holy Communion (Interactive Storybook: St. Brigid & GitHub Pages Edition)

We have transformed the presentation into a **museum-quality interactive storybook** and created a dedicated repository ready to be deployed to **GitHub Pages**. We also added **St. Brigid of Kildare** as a new interactive saint exhibit!

- **New Dedicated Directory**: [d:\communion-exhibition](file:///d:/communion-exhibition)
  - **Standalone compiled index**: [index.html](file:///d:/communion-exhibition/index.html) (5.86 MB) — This is the compiled production file for your GitHub Pages deployment.
  - **Source files**: [index_src.html](file:///d:/communion-exhibition/index_src.html), [index.css](file:///d:/communion-exhibition/index.css), and [index.js](file:///d:/communion-exhibition/index.js) are clean and separate.
  - **Deployment Workflow**: Setup [.github/workflows/deploy.yml](file:///d:/communion-exhibition/.github/workflows/deploy.yml) to automatically publish the site to GitHub Pages on every push to `main`.

---

## ✨ St. Brigid of Kildare Exhibit (Section 5)

We added Saint Brigid following the exact same high-end **Museum Edition** layout:
1. **Interactive Wood & Gold Gallery Frame**:
   - Saint Brigid's portrait is mounted inside a thick dark-wood frame with a polished gold inlay, protected by a glass reflection overlay and spotlight glow.
2. **Lithurgical Color Palette**:
   - Deep emerald-green and gold ambient glow matching Kildare's historic oak groves and fire.
3. **Interactive Symbols & Zoom Focus**:
   - **St. Brigid's Cross**: Woven from rushes, representing faith and protection. Centered at X = 50%, Y = 55% (`scale(1.8) translateY(-5%)`).
   - **The Abbess Crozier (Staff)**: Representing her spiritual leadership. Centered at X = 75%, Y = 18% (`scale(1.8) translateY(24%) translateX(-20%)`).
   - **The Perpetual Flame**: Representing Christian charity and Kildare's holy light. Centered at X = 20%, Y = 68% (`scale(1.8) translateY(-14%) translateX(22%)`).
4. **Generalized Interaction Controller (Bug Fixed)**:
   - Refactored `index.js` to support multiple Saint Exhibits dynamically without hardcoding.
   - Fixed the text-overlap bug: clicking **Back to Overview** on either Patrick or Brigid now correctly hides the detail cards and shows only the relevant section's default description.

---

## 🔎 How to Deploy to GitHub Pages

1. **Initialize Git**:
   ```bash
   cd d:\communion-exhibition
   git init
   git add .
   git commit -m "Initial commit: Communion Exhibition"
   ```
2. **Push to GitHub**:
   Create a new public repository on GitHub called `communion-exhibition`, then run:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/communion-exhibition.git
   git branch -M main
   git push -u origin main
   ```
3. **Enable GitHub Pages**:
   Go to your repository settings on GitHub -> **Pages** -> under **Build and deployment**, select **GitHub Actions** as the source. The workflow we configured will automatically deploy your site!
