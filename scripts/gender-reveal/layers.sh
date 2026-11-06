#!/bin/sh
# Render the static design layers to public/gender-reveal-layers/*.png
set -e
mkdir -p public/gender-reveal-layers
for l in bg frame card; do
  npx remotion still GenderRevealLayers public/gender-reveal-layers/$l.png --props="{\"layer\":\"$l\"}" --image-format=png --log=error
done
