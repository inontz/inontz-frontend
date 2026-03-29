#!/bin/bash

# Generate PWA icons from the SVG
# Requires: ImageMagick (convert command)

echo "Generating PWA icons..."

SIZES=(72 96 128 144 152 192 384 512)
OUTPUT_DIR="public/icons"

for size in "${SIZES[@]}"; do
  echo "Generating ${size}x${size}..."
  convert -background "#6366f1" -fill white -gravity center -size ${size}x${size} \
    -pointsize $((size/2)) label:"🤖" \
    "${OUTPUT_DIR}/icon-${size}x${size}.png" 2>/dev/null || echo "  Failed (ImageMagick not installed)"
done

echo "Done!"
echo ""
echo "If convert failed, please:"
echo "1. Install ImageMagick: brew install imagemagick (macOS) or apt-get install imagemagick (Linux)"
echo "2. Run this script again"
echo ""
echo "Or use the browser method:"
echo "1. Open public/icons/generate-icons.html in a browser"
echo "2. Click 'Generate All Icons' then 'Download All'"
