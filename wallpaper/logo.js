(() => {
  const canvas = document.getElementById('logo');
  const ctx = canvas.getContext('2d');
  const source = new Image();
  function draw() {
    if (!source.complete || !source.naturalWidth) return;
    const width = Math.max(1, Math.round(window.innerWidth * 0.20));
    const height = Math.round(width * 285 / 1215);
    const cellW = 4, cellH = 6;
    const cols = Math.max(1, Math.floor(width / cellW));
    const rows = Math.max(1, Math.floor(height / cellH));
    const sample = document.createElement('canvas');
    sample.width = cols; sample.height = rows;
    const sc = sample.getContext('2d', {willReadFrequently: true});
    sc.drawImage(source, 0, 0, cols, rows);
    const pixels = sc.getImageData(0, 0, cols, rows).data;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = '600 6px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const chars = ':;t%SX8#@';
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const alpha = pixels[(y * cols + x) * 4 + 3];
      if (alpha < 95) continue;
      const hash = (x * 31 + y * 71 + x * y * 7) >>> 0;
      ctx.fillStyle = `rgba(35,35,35,${0.52 + (hash % 30) / 100})`;
      ctx.fillText(chars[hash % chars.length], (x + .5) * cellW, (y + .5) * cellH);
    }
  }
  source.onload = draw;
  source.src = "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjI4NSIgdmlld0JveD0iMCAwIDEyMTUgMjg1IiB3aWR0aD0iMTIxNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjMDAwIj48cGF0aCBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Im03MjAgMTIwaC0xNXYxNWgtMTQuOTk4djE0Ljk5OWwtNjAuMDAyLjAwMXYxNS4wMDJsOTAtLjAwMnYuMDAyaC4wMDJsLS4wMDIgODkuOTk4aC0xNXYxNWgtMTN2MTVoLTE3di04OS45OThoLTQ1djkwbC00NS0uMDAydi04OS45OThoLTE0Ljk5OHYtMzBoMTQuOTk4di0xNS4wMDJoLTE0Ljk5OHYtMzAuMDAxaDE0Ljk5OHYtNzVoMTV2LTE0Ljk5N2gxNXYtMTUuMDAyaDEwNS4wMDJ6bS05MC0uMDAxaDQ1di03NC45OTdoLTQ1eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJtMTA1IDMwLjAwMmgxNXYxNC45OTdoMTV2MTgwLjAwMWgtMTV2MTVoLTE1djE1LjAwMmgtNzV2LTE1LjAwMmgtMTV2LTE1aC0xNXYtMTgwLjAwMWgxNXYtMTQuOTk3aDE1di0xNS4wMDJoNzV6bS02MCAxOTQuOTk4aDQ1di0xNzkuOTk4aC00NXoiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGQ9Im0zMDAgMTVoNjB2MTVoMTV2MTQuOTk5aDE1djE4MC4wMDFoLTE1djE1aC0xNXYxNWgtMTVsLS4wMDQtMjA5Ljk5OGgtNDQuOTk0di0uMDAyaC0uMDAydjIxMC4wMDJoLTQ1di0yMTBoLTQ0Ljk5OHYxNzkuOTk3aC0uMDAydjMwLjAwM2gtMTV2LTE1LjAwMmgtMTV2LTE1aC0xNC45OTh2LTE4MC4wMDFoMTQuOTk4di0xNC45OTloMTV2LTE1aDYwdi0xNWg0NXoiLz48cGF0aCBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Im01NTUgMjI1aC0xNXYxNWgtMTV2MTVoLTE1di0xMDUuMDAxbC00NC45OTguMDAxdjEwNS4wMDJoLTQ1LjAwMnYtMTA1LjAwMmgtMTV2LTMwLjAwMWgxNXYtNzVoMTUuMDAydi0xNC45OTdoMTV2LTE1LjAwMmgxMDV6bS04OS45OTgtMTA1LjAwMWg0NC45OTh2LTc0Ljk5N2gtNDQuOTk4eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PHBhdGggZD0ibTg4NSA3NWgtMTV2MTVoLTE1djE1aC0xNXYtNTkuOTk4aC00NXYxNzkuOTk4aDQ1di01OS45OThoMTV2MTQuOTk3aDE1djE1LjAwMWgxNXYzMGgtMTV2MTVoLTE1djE1LjAwMmwtMTA1LS4wMDJ2LTIxMC4wMDFoMTQuOTk4di0xNC45OTdoMTUuMDAydi0xNS4wMDJoMTA1eiIvPjxwYXRoIGQ9Im05NjAgMTE5Ljk5OWg0NXYtMTA0Ljk5OWgxNXYxNWgxNXYxNC45OTloMTV2NzUuMDAxaDE1djE1aC0xNXY5MGgtMTV2MTVoLTE1djE1aC0xNXYtMTA1aC00NXYxMDUuMDAybC00NS0uMDAydi0xMDVoLTMwdi0xNWgxNXYtMTUuMDAxaDE1di03NWgxNXYtMTQuOTk3aDE1di0xNS4wMDJoMTV6Ii8+PHBhdGggZD0ibTExMjUgMTE5Ljk5OWg0NXYtMTA0Ljk5OWgxNXYxNWgxNXYxNWgxNXYxODBoLTE1djE1aC0xNXYxNS4wMDJsLTc1LS4wMDJ2LTE1aC0xNXYtMTVoLTE1di00NS4wMDFoMTV2LTE0Ljk5Ny0uMDAyaDMwdjYwaDQ1di03NWgtOTB2LTEwNS4wMDFoMTV2LTE0Ljk5N2gxNXYtMTUuMDAyaDE1eiIvPjwvZz48L3N2Zz4K";
  window.addEventListener('resize', draw);
})();
