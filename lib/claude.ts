import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const SYSTEM_PROMPT = `You are an expert web designer and developer specializing in creating visually stunning, animated web pages.

When generating HTML, always:
- Return ONLY valid HTML/CSS/JS — no markdown, no code fences, no explanations
- Use modern CSS (variables, grid, flexbox, clamp, backdrop-filter)
- Leverage GSAP for animations (it's pre-loaded: gsap, ScrollTrigger, TextPlugin)
- Leverage Three.js for 3D effects (it's pre-loaded as THREE)
- Design for full-screen (100vw/100vh as base, scrollable if needed)
- Use a dark, modern aesthetic by default unless specified otherwise
- Make animations smooth and purposeful — not gratuitous
- Ensure all interactive elements have hover/focus states

Available globals in the sandbox:
- gsap (with ScrollTrigger, TextPlugin)
- THREE (Three.js r128)

CRITICAL: Your response must be raw HTML only. Nothing else.`;

export const AREA_SYSTEM_PROMPT = `You are an expert web developer modifying a specific section of an existing page.

Rules:
- Return ONLY the modified HTML for the selected element
- Preserve the element's tag and ID if it has one
- Apply the requested changes while keeping the same overall structure
- You may add inline <style> or <script> tags within the returned HTML
- GSAP and THREE are available globally

CRITICAL: Return raw HTML only. No explanations, no markdown.`;

export type StreamCallback = (chunk: string) => void;

export async function streamGenerate(
  prompt: string,
  currentHtml: string,
  history: Array<{ role: "user" | "assistant"; content: string }>,
  onChunk: StreamCallback
): Promise<string> {
  const messages: Anthropic.MessageParam[] = [];

  // Inject past turns so Claude remembers design direction
  for (let i = 0; i + 1 < history.length; i += 2) {
    const user = history[i];
    const assistant = history[i + 1];
    if (user?.role === "user" && assistant?.role === "assistant") {
      messages.push({ role: "user", content: user.content });
      // Placeholder avoids re-sending full HTML for every past turn
      messages.push({ role: "assistant", content: "[HTML updated successfully]" });
    }
  }

  messages.push({
    role: "user",
    content: currentHtml
      ? `Current page HTML:\n${currentHtml}\n\nRequest: ${prompt}`
      : prompt,
  });

  let fullResponse = "";

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages,
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      fullResponse += event.delta.text;
      onChunk(event.delta.text);
    }
  }

  return fullResponse;
}

export async function streamAreaModify(
  prompt: string,
  selectedHtml: string,
  fullPageHtml: string,
  onChunk: StreamCallback
): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: `Full page context:\n${fullPageHtml}\n\nSelected element:\n${selectedHtml}\n\nModification request: ${prompt}`,
    },
  ];

  let fullResponse = "";

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: AREA_SYSTEM_PROMPT,
    messages,
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      fullResponse += event.delta.text;
      onChunk(event.delta.text);
    }
  }

  return fullResponse;
}
