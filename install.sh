#!/usr/bin/env bash
set -euo pipefail
repo=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
app="$HOME/.local/share/ascii-ocean-wallpaper"
background="$HOME/.config/omarchy/backgrounds/white/ascii-ocean-live.png"
unit="$HOME/.config/systemd/user/ascii-ocean-wallpaper.service"
for cmd in g++ pkg-config systemctl omarchy; do
  command -v "$cmd" >/dev/null || { echo "Missing dependency: $cmd" >&2; exit 1; }
done
[[ "$(omarchy theme current | tr "[:upper:]" "[:lower:]")" == "white" ]] || { echo "Select the Omarchy White theme first" >&2; exit 1; }
pkg-config --exists Qt6WebEngineQuick Qt6Quick || { echo 'Missing Qt 6 WebEngine / Quick development files' >&2; exit 1; }
for path in "$app" "$background" "$unit"; do
  [[ ! -e "$path" ]] || { echo "Already exists, refusing to overwrite: $path" >&2; exit 1; }
done
mkdir -p "$app" "$(dirname "$background")" "$(dirname "$unit")"
cp "$repo"/wallpaper/{main.cpp,view.qml,index.html,logo.js,omarchy-logo.svg,ocean.js} "$app/"
cp "$repo/assets/thumbnail.png" "$background"
cp "$repo/systemd/ascii-ocean-wallpaper.service" "$unit"
g++ -fPIC -pie -std=c++17 "$app/main.cpp" -o "$app/ocean-wallpaper" $(pkg-config --cflags --libs Qt6WebEngineQuick Qt6Quick) -lLayerShellQtInterface
systemctl --user daemon-reload
systemctl --user enable --now ascii-ocean-wallpaper.service
omarchy theme bg set "$background"
echo 'Installed. Select ASCII Ocean Live in the Omarchy background switcher to show it again.'
