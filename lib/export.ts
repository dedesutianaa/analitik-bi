/**
 * Client-side export helpers. Everything runs in the browser so the static
 * prototype can offer real "unduh" behaviour without a backend.
 */

function toCsv(rows: (string | number)[][]) {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const value = String(cell ?? "");
          return /[";\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
        })
        .join(";"),
    )
    .join("\r\n");
}

export function downloadFile(filename: string, content: string, mime: string) {
  downloadBlob(filename, new Blob([content], { type: mime }));
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  // The BOM keeps Excel from mangling the Indonesian characters.
  downloadFile(filename, `\uFEFF${toCsv(rows)}`, "text/csv;charset=utf-8;");
}

export function downloadJson(filename: string, data: unknown) {
  downloadFile(filename, JSON.stringify(data, null, 2), "application/json");
}

/** Design tokens that chart elements reference through `var(...)`. */
const CHART_TOKENS = [
  "--brand",
  "--brand-strong",
  "--violet",
  "--mint",
  "--danger",
  "--amber",
  "--sky",
  "--line",
  "--line-soft",
  "--ink",
  "--ink-soft",
  "--ink-muted",
  "--surface",
];

/**
 * Renders a live SVG chart to a PNG. Recharts draws with `var(--token)` fills,
 * so the tokens are inlined into a `<style>` node first — otherwise the exported
 * image would lose the palette (or render black in dark mode).
 */
export function downloadChartPng(
  svg: SVGSVGElement,
  filename: string,
  background: string,
  onDone?: () => void,
) {
  const box = svg.getBoundingClientRect();
  if (!box.width || !box.height) return;

  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("width", String(box.width));
  clone.setAttribute("height", String(box.height));

  const computed = getComputedStyle(document.documentElement);
  const declarations = CHART_TOKENS.map((token) => `${token}:${computed.getPropertyValue(token)}`).join(";");
  const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
  style.textContent = `:root{${declarations}}`;
  clone.insertBefore(style, clone.firstChild);

  const markup = new XMLSerializer().serializeToString(clone);
  const image = new Image();

  image.onload = () => {
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(box.width * scale);
    canvas.height = Math.round(box.height * scale);
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.scale(scale, scale);
    context.drawImage(image, 0, 0, box.width, box.height);
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(filename, blob);
      onDone?.();
    }, "image/png");
  };

  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
}
