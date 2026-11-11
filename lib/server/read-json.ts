/** Read and parse a JSON request while enforcing content-type and byte limits. */
export type JsonReadReason = 'too_large' | 'invalid_json' | 'unsupported_media_type';
export type JsonReadResult =
  | { ok: true; value: unknown }
  | { ok: false; reason: JsonReadReason };

export async function readJsonRequest(req: Request, maxBytes: number): Promise<JsonReadResult> {
  const contentType = req.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
  if (contentType !== 'application/json') {
    return { ok: false, reason: 'unsupported_media_type' };
  }

  const contentLength = req.headers.get('content-length');
  if (contentLength) {
    const declaredLength = Number(contentLength);
    if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
      return { ok: false, reason: 'too_large' };
    }
  }

  const reader = req.body?.getReader();
  if (!reader) return { ok: false, reason: 'invalid_json' };

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel().catch(() => undefined);
        return { ok: false, reason: 'too_large' };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, reason: 'invalid_json' };
  }

  try {
    const bytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const source = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return { ok: true, value: JSON.parse(source) as unknown };
  } catch {
    return { ok: false, reason: 'invalid_json' };
  }
}

export function jsonReadStatus(reason: JsonReadReason): number {
  if (reason === 'too_large') return 413;
  if (reason === 'unsupported_media_type') return 415;
  return 400;
}

export function jsonReadError(reason: JsonReadReason) {
  if (reason === 'too_large') return { error: 'Request body is too large.' };
  if (reason === 'unsupported_media_type') return { error: 'Content-Type must be application/json.' };
  return { error: 'Request body must be valid JSON.' };
}
