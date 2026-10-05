# Original ENCORE photographic artwork

Created with the built-in image-generation tool for this project. No UI text is baked into the images. The existing mockups were visual inspiration, not cropped assets.

- assets/backstage.webp: empty backstage wing looking over an amber-lit concert stage and crowd, dark curtain and equipment at left, real concert photography style, no foreground performer or text.
- assets/estate.webp: modern hillside residence with pool at sunset, forest-green shadows, warm interior lighting and champagne sunset, realistic property photography, no people or text.

Generated PNG originals remain in the generation output; these WebP copies are compressed for delivery. src/artwork.js contains the exact WebP bytes as data URLs and is consumed by the build. To replace an image, replace its data URL in ENCORE_ART, then run npm run build. No layout or controls are embedded in these images.

## Living-world assets
Ten additional original generated photographs are in assets/: coupe, hypercar, chain, watch, canvas, sculpture, condo, villa, duplex and block. Compressed WebP copies are embedded by src/asset-photos.js for offline availability. Brand names and financial instruments are fictional.

## 0.7.1 illustrated cast and product variants
Created with the built-in image-generation tool for ENCORE. Art direction: eight original illustrated adult music-industry characters, editorial hand-painted style, cohesive dark teal/gold palette, four-by-two portrait atlas. No celebrity likenesses requested. `assets/illustrated-cast.webp` is assigned by stable identity hash (explicit assignments for six agents).

Eight three-panel merchandise images: tee, hoodie, cap, vinyl, poster, zine, tote and collector box. Prompts requested isolated product photography with three original designs: black/gold soundwave, ivory/cobalt geometry, burgundy/botanical. Files: `assets/merch-*.webp`. CSS selects the panel; no generated lettering is used for interface information.

Additional original luxury product scenes: roadster, penthouse interior and sapphire jewelry, in `assets/roadster.webp`, `assets/penthouse.webp`, `assets/sapphire.webp`. Images were resized/compressed to WebP and embedded by `src/people-products.js` for offline availability. No external image service is required. Limited edition labels may reuse product art.
