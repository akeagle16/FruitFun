# Fruit Builder

Point your phone at a banana, apple or pineapple. The app recognizes it and walks you through a Lego-style build:

| Fruit | Creation | Steps |
|---|---|---|
| Banana | Dolphin | 6 |
| Apple | Swan | 10 |
| Pineapple | Butterflies | 7 |

Steps are marked as **Knife step** (kid-safe knife) or **Grown-up step** (real knife, adult only). Each creation also links to a YouTube video.

## Put it on GitHub Pages

1. Create a new repo, for example `fruit-builder`.
2. Upload everything in this folder to the repo root, including `.nojekyll` and `vendor/`.
3. Go to **Settings → Pages → Build and deployment**, set **Source** to *Deploy from a branch*, then choose `main` and `/ (root)`. Save.
4. After about a minute the app is live at `https://<your-username>.github.io/fruit-builder/`.
5. Open that link on your phone and allow camera access. Optionally, use **Add to Home Screen**.

The camera only works over **https**, which GitHub Pages provides. Opening `index.html` straight from your computer won't get camera access.

## Testing

- **First scan:** it downloads the recognition model (~14 MB) from Google's TF Hub. After that, the browser caches it.
- **Demo mode:** add `?demo=banana`, `?demo=apple` or `?demo=pineapple` to the URL. The app pretends it saw that fruit, so you can test the flow without the real thing.
- **Pick instead:** this button always skips the camera.
- **Navigating steps:** swipe the illustration, use the buttons, or use the ← → keys on a computer.

## How recognition works

The app runs MobileNet v2, a model trained on ImageNet, on the phone itself. No photos leave the device.

- The model has its own labels for *banana*, *pineapple* and *Granny Smith* apple.
- Red apples have no label of their own, so they get partial credit from *pomegranate* and *fig*.
- A fruit only counts as detected once it's the top match in 3 of the last 4 frames.

To tune this, edit `LABELS` and the `0.25` threshold in `app.js`. For more reliable apples, you could train a custom model with Google Teachable Machine and swap it in.

## Files

| File | What it holds |
|---|---|
| `index.html` | Page shell |
| `styles.css` | All styling |
| `creations.js` | Fruits, step text, badges, video links, knife link. Edit here to change wording or add a creation. |
| `art.js` | Original SVG illustrations, one per step plus a finished piece per fruit |
| `app.js` | Screens, camera, recognition, navigation |
| `vendor/` | TensorFlow.js 4.22 and MobileNet 2.1.1 (Apache-2.0), bundled so there's no CDN dependency |
