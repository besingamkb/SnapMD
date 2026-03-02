import type MarkdownIt from 'markdown-it';

/**
 * markdown-it plugin that renders ```mermaid fenced blocks as
 * <div class="mermaid">…</div> instead of <pre><code>.
 */
export function mermaidPlugin(md: MarkdownIt): void {
  const defaultFence = md.renderer.rules.fence;

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const info = token.info.trim().toLowerCase();

    if (info === 'mermaid') {
      const escaped = md.utils.escapeHtml(token.content);
      return `<div class="mermaid">${escaped}</div>\n`;
    }

    if (defaultFence) {
      return defaultFence(tokens, idx, options, env, self);
    }
    return self.renderToken(tokens, idx, options);
  };
}
