#!/bin/sh
# Re-import the API content from document.payfuture.net into api-data.js.
# Needs: curl, python3, Google Chrome (used headless to read the examples, which live in page scripts).
# Usage: sh tools/refresh.sh
set -e
ROOT=$(cd "$(dirname "$0")/.." && pwd)
WORK=$(mktemp -d)
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p "$WORK/ige"
cd "$WORK/ige"
for p in index payout refund balance other error-code sandbox; do
  f="$p.shtml"; [ "$p" = index ] && f=""
  curl -sfL -m 30 -o "$p.html" "https://document.payfuture.net/$f"
done
curl -sfL -m 30 -o ErrorCodeList.json https://document.payfuture.net/src/ErrorCodeList.json
for p in index payout refund balance other; do
  python3 "$ROOT/tools/extract_examples.py" "$p.html" "$p.ex.html"
  "$CHROME" --headless=new --disable-gpu --dump-dom "file://$WORK/ige/$p.ex.html" 2>/dev/null \
    | python3 "$ROOT/tools/extract_examples.py" --read > "$p.examples.json"
done
cd "$ROOT"
python3 tools/parse_sites.py "$WORK" | tail -7
python3 tools/build_data.py "$WORK"
echo "Live-docs review notes: $WORK/REVIEW-live-docs.md"
echo "Done. Run python3 tools/stamp.py, open index.html to check, then commit."
