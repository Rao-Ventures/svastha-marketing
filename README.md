# Svastha Marketing Site

GitHub Pages marketing site for mobile app Svastha - https://svastha.co.

## Structure

```
/
├── index.html          # Main landing page
├── icon.png            # App icon
├── om-symbol.svg       # OM symbol asset
├── screenshot-home.png
├── screenshot-scripture.png
├── screenshot-chat.png
├── screenshot-progress.png
└── screenshots/        # Source screenshots
```

## Deployment

This site deploys automatically to GitHub Pages via GitHub Actions on every push to `main`.

To enable GitHub Pages:
1. Go to the repo **Settings → Pages**
2. Set **Source** to `GitHub Actions`
3. Push to `main` — the workflow handles the rest

## Local Preview

Open `index.html` directly in your browser, or serve it with any static server:

```bash
npx serve .
```

## Syncing Legal Documents

The Privacy Policy, Terms of Service, and Cookie and App Storage Policy are generated from Markdown in the sibling `svastha/docs/legal` directory. Account-deletion instructions are included in the Privacy Policy.

To sync and generate the legal pages:

1. Make sure the `svastha` repository is cloned beside this repository and contains the intended release's legal sources. The generator falls back to `/Users/ying/Dev/svastha/docs/legal` if the sibling directory is unavailable.
2. Run the generation script:
   ```bash
   node scripts/generate-legal-html.js
   ```
3. Review all three generated pages in `legal/`, including links and update dates. Edit Markdown sources or the generator rather than generated HTML.
4. Commit and push the updated sources and generated pages when ready to deploy.

## Updating the iOS Download Link

Once the app is live on the App Store, update the `href` on the `#ios-download-btn` element in `index.html` and remove the `btn-disabled` class.

