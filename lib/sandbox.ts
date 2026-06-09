// CDN scripts pre-loaded in every sandbox frame
const CDN_SCRIPTS = `
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/TextPlugin.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>`;

// GSAP plugin registration + hover highlight + click-to-select
const SANDBOX_SCRIPTS = `<script>
(function() {
  // Register GSAP plugins
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
    if (typeof TextPlugin  !== 'undefined') gsap.registerPlugin(TextPlugin);
  }

  // Hover highlight overlay
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;pointer-events:none;z-index:2147483647;border:2px solid rgba(124,58,237,0.8);background:rgba(124,58,237,0.07);border-radius:3px;display:none;';
  var badge = document.createElement('span');
  badge.style.cssText = 'position:absolute;top:-22px;left:0;background:#7c3aed;color:#fff;font:11px/1 monospace;padding:3px 6px;border-radius:3px;white-space:nowrap;';
  ov.appendChild(badge);
  document.body.appendChild(ov);

  function sel(el) {
    if (el.id) return '#' + el.id;
    var tag = el.tagName.toLowerCase();
    var cls = Array.from(el.classList).slice(0,2).join('.');
    return cls ? tag + '.' + cls : tag;
  }

  document.addEventListener('mouseover', function(e) {
    var el = e.target;
    if (!el || el === document.body || el === document.documentElement || el === ov) return;
    var r = el.getBoundingClientRect();
    ov.style.cssText += ';top:' + r.top + 'px;left:' + r.left + 'px;width:' + r.width + 'px;height:' + r.height + 'px;display:block;';
    badge.textContent = sel(el);
  }, true);

  document.addEventListener('mouseout', function(e) {
    if (!e.relatedTarget || e.relatedTarget === document.documentElement) ov.style.display = 'none';
  }, true);

  document.addEventListener('click', function(e) {
    var el = e.target;
    if (!el || el === document.body || el === document.documentElement || el === ov) return;
    var r = el.getBoundingClientRect();
    window.parent.postMessage({
      type: 'ELEMENT_SELECTED',
      payload: { html: el.outerHTML, selector: sel(el), rect: { x: r.x, y: r.y, width: r.width, height: r.height } }
    }, '*');
  });
})();
<\/script>`;

const SANDBOX_BASE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Canvas</title>
  ${CDN_SCRIPTS}
  <style>* { margin:0; padding:0; box-sizing:border-box; } html,body { width:100%; height:100%; overflow-x:hidden; }</style>
</head>
<body>
  %%CONTENT%%
  ${SANDBOX_SCRIPTS}
</body>
</html>`;

export function buildSandboxDoc(contentHtml: string): string {
  const trimmed = contentHtml.trim();
  if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html")) {
    return injectIntoFullDoc(contentHtml);
  }
  return SANDBOX_BASE.replace("%%CONTENT%%", contentHtml);
}

function injectIntoFullDoc(html: string): string {
  let result = html;

  // Inject CDN scripts before </head> if GSAP is not already included
  if (!result.includes("gsap.min.js") && !result.includes("gsap.js")) {
    if (result.includes("</head>")) {
      result = result.replace("</head>", CDN_SCRIPTS + "\n</head>");
    } else {
      // No </head> tag — prepend scripts
      result = CDN_SCRIPTS + "\n" + result;
    }
  }

  // Inject hover + selection scripts before </body>
  if (result.includes("</body>")) {
    result = result.replace(/(<\/body>)/i, SANDBOX_SCRIPTS + "\n$1");
  } else {
    result += "\n" + SANDBOX_SCRIPTS;
  }

  return result;
}

export async function streamFromAPI(
  prompt: string,
  currentHtml: string,
  mode: "generate" | "area",
  selectedHtml: string | null,
  onChunk: (chunk: string) => void,
  history: Array<{ role: "user" | "assistant"; content: string }> = []
): Promise<string> {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, currentHtml, mode, selectedHtml, history }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }
  if (!res.body) throw new Error("No response body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    // Keep the last incomplete line in the buffer
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") return fullText;
      try {
        const parsed = JSON.parse(data);
        if (parsed.error) throw new Error(parsed.error);
        if (parsed.chunk) {
          fullText += parsed.chunk;
          onChunk(parsed.chunk);
        }
      } catch (err) {
        if (err instanceof Error && err.message !== "Unexpected end of JSON input") {
          throw err;
        }
      }
    }
  }

  return fullText;
}
