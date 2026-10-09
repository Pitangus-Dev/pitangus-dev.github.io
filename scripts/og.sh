#!/bin/sh
# Renders the share pictures (public/og-en.jpg, public/og-es.jpg) from /og/en/ and /og/es/: build first, then run
# `pnpm run preview -- --port 4322` in another terminal. Needs a headless Chromium (CHROME, e.g. Playwright's
# chrome-headless-shell) and Python with Pillow for the JPEG.
set -eu
CHROME="${CHROME:?point CHROME at a headless Chromium binary}"
URL="${URL:-http://127.0.0.1:4322}"
tmp="$(mktemp -d)"
for lang in en es; do
  "$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1200,630 \
    --virtual-time-budget=4000 --screenshot="$tmp/og-$lang.png" "$URL/og/$lang/" 2>/dev/null
  python3 -c "from PIL import Image; Image.open('$tmp/og-$lang.png').convert('RGB').save('public/og-$lang.jpg', quality=86, optimize=True, progressive=True)"
done
rm -rf "$tmp"
echo "public/og-en.jpg public/og-es.jpg"
