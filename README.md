# Svastha Marketing Site

GitHub Pages marketing site for the [Svastha](https://svastha.expo.app) mobile app.

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

## Updating the iOS Download Link

Once the app is live on the App Store, update the `href` on the `#ios-download-btn` element in `index.html` and remove the `btn-disabled` class.
