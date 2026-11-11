export const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;
export const MAX_ATTACHMENT_BASE64_CHARS = 4 * Math.ceil(MAX_ATTACHMENT_BYTES / 3);

/** Validate the padded standard Base64 emitted by FileReader.readAsDataURL. */
export function isValidBase64(value: string): boolean {
  if (!value || value.length > MAX_ATTACHMENT_BASE64_CHARS || value.length % 4 !== 0) return false;

  const padding = value.endsWith('==') ? 2 : value.endsWith('=') ? 1 : 0;
  const dataLength = value.length - padding;
  if (dataLength === 0) return false;

  // Avoid a single large regular-expression match: megabyte-sized uploads can
  // exceed the regex engine's internal backtracking/stack limits.
  for (let i = 0; i < dataLength; i++) {
    const code = value.charCodeAt(i);
    const valid = (code >= 65 && code <= 90)
      || (code >= 97 && code <= 122)
      || (code >= 48 && code <= 57)
      || code === 43
      || code === 47;
    if (!valid) return false;
  }
  for (let i = dataLength; i < value.length; i++) {
    if (value.charCodeAt(i) !== 61) return false;
  }
  return getBase64ByteLength(value) <= MAX_ATTACHMENT_BYTES;
}

export function getBase64ByteLength(value: string): number {
  const padding = value.endsWith('==') ? 2 : value.endsWith('=') ? 1 : 0;
  return (value.length / 4) * 3 - padding;
}
