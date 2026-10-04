# Original ENCORE photographic artwork

Created with the built-in image-generation tool for this project. No UI text is baked into the images. The existing mockups were visual inspiration, not cropped assets.

- assets/backstage.webp: empty backstage wing looking over an amber-lit concert stage and crowd, dark curtain and equipment at left, real concert photography style, no foreground performer or text.
- assets/estate.webp: modern hillside residence with pool at sunset, forest-green shadows, warm interior lighting and champagne sunset, realistic property photography, no people or text.

Generated PNG originals remain in the generation output; these WebP copies are compressed for delivery. src/artwork.js contains the exact WebP bytes as data URLs and is consumed by the build. To replace an image, replace its data URL in ENCORE_ART, then run npm run build. No layout or controls are embedded in these images.
