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

The legal documents (Privacy Policy and Terms of Service) are generated from the markdown source files in the main `svastha` repository.

To sync and generate the legal pages:

1. Make sure you have the `svastha` repository cloned. By default, the generator script expects it to be located at `/Users/ying/Dev/svastha` (or you can edit `svasthaLegalDir` in `scripts/generate-legal-html.js` if it's located elsewhere).
2. Run the generation script:
   ```bash
   node scripts/generate-legal-html.js
   ```
3. Commit and push the updated files in the `legal/` folder.

## Updating the iOS Download Link

Once the app is live on the App Store, update the `href` on the `#ios-download-btn` element in `index.html` and remove the `btn-disabled` class.

