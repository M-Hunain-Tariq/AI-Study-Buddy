import React from 'react';

/**
 * Small dependency-free renderer for the formatting the AI tutor uses:
 * paragraphs, **bold**, *italic*, `code`, code blocks, headings, bullet/numbered
 * lists, quotes, simple tables and horizontal rules. Safe: it never injects raw HTML.
 */

function inline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(__[^_\n]+__)|(\*[^*\s][^*\n]*\*)/g;
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyPrefix}-${i++}`;
    if (m[1]) {
      nodes.push(
        <code key={key} className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.92em] text-cyan-200">
          {tok.slice(1, -1)}
        </code>,
      );
    } else if (m[2] || m[3]) {
      nodes.push(
        <strong key={key} className="font-semibold text-white">
          {tok.slice(2, -2)}
        </strong>,
      );
    } else {
      nodes.push(<em key={key}>{tok.slice(1, -1)}</em>);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

const BULLET = /^\s*[-*•]\s+(.*)$/;
const NUMBERED = /^\s*(\d+)[.)]\s+(.*)$/;
const HEADING = /^(#{1,4})\s+(.*)$/;
const TABLE_SEP = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;

function splitRow(line: string): string[] {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}

export const MarkdownText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let k = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    // fenced code block (an unterminated one, while streaming, shows what has arrived)
    if (line.trim().startsWith('```')) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) code.push(lines[i++]);
      i++;
      blocks.push(
        <pre key={k++} className="my-2 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-3 text-[12px] leading-relaxed text-slate-100">
          <code className="font-mono">{code.join('\n')}</code>
        </pre>,
      );
      continue;
    }

    if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) {
      blocks.push(<hr key={k++} className="my-3 border-white/10" />);
      i++;
      continue;
    }

    const h = line.match(HEADING);
    if (h) {
      const level = h[1].length;
      const cls =
        level <= 2 ? 'mt-3 mb-1 text-base font-bold text-white' : 'mt-3 mb-1 text-sm font-bold text-indigo-200';
      blocks.push(
        <div key={k++} className={cls}>
          {inline(h[2], `h${k}`)}
        </div>,
      );
      i++;
      continue;
    }

    // table
    if (line.includes('|') && i + 1 < lines.length && TABLE_SEP.test(lines[i + 1])) {
      const header = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) rows.push(splitRow(lines[i++]));
      blocks.push(
        <div key={k++} className="my-2 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-[12px]">
            <thead>
              <tr>
                {header.map((c, ci) => (
                  <th key={ci} className="border border-white/15 bg-white/5 px-3 py-1.5 font-semibold text-white">
                    {inline(c, `th${k}-${ci}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri}>
                  {r.map((c, ci) => (
                    <td key={ci} className="border border-white/10 px-3 py-1.5">
                      {inline(c, `td${k}-${ri}-${ci}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // lists
    if (BULLET.test(line) || NUMBERED.test(line)) {
      const ordered = NUMBERED.test(line);
      const items: string[] = [];
      let start = 1;
      if (ordered) start = Number(line.match(NUMBERED)![1]);
      while (i < lines.length) {
        const bm = lines[i].match(BULLET);
        const nm = lines[i].match(NUMBERED);
        if (ordered && nm) items.push(nm[2]);
        else if (!ordered && bm) items.push(bm[1]);
        else if (lines[i].trim() && /^\s{2,}\S/.test(lines[i]) && items.length) items[items.length - 1] += ' ' + lines[i].trim();
        else break;
        i++;
      }
      const ListTag = ordered ? 'ol' : 'ul';
      blocks.push(
        <ListTag
          key={k++}
          start={ordered ? start : undefined}
          className={`my-2 space-y-1 pl-5 ${ordered ? 'list-decimal' : 'list-disc'} marker:text-indigo-300`}
        >
          {items.map((it, ii) => (
            <li key={ii} className="pl-1">
              {inline(it, `li${k}-${ii}`)}
            </li>
          ))}
        </ListTag>,
      );
      continue;
    }

    // quote
    if (line.trim().startsWith('>')) {
      const q: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) q.push(lines[i++].replace(/^\s*>\s?/, ''));
      blocks.push(
        <blockquote key={k++} className="my-2 border-l-2 border-indigo-400/60 pl-3 text-slate-300">
          {inline(q.join(' '), `q${k}`)}
        </blockquote>,
      );
      continue;
    }

    // paragraph
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('```') &&
      !HEADING.test(lines[i]) &&
      !BULLET.test(lines[i]) &&
      !NUMBERED.test(lines[i]) &&
      !lines[i].trim().startsWith('>')
    ) {
      para.push(lines[i++]);
    }
    if (para.length === 0) {
      i++;
      continue;
    }
    blocks.push(
      <p key={k++} className="whitespace-pre-line">
        {inline(para.join('\n'), `p${k}`)}
      </p>,
    );
  }

  return <div className="space-y-2 text-xs leading-relaxed sm:text-sm">{blocks}</div>;
};
