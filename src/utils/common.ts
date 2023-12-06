/** Returns a promise that resolves when a specified time interval has completed */
export function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

/** Check if a string contains only printable ASCII characters */
export function isPrintableASCII(str: string): boolean {
  return /^[\x20-\x7E]*$/.test(str);
}

/** Convert a number to a single byte (not super necessary but a nice safeguard) */
export function toByte(num: number): number {
  return num & 0xff;
}

/** Convert a string to a byte array */
export function stringToBytes(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

/** Get current time in HH:mm:ss.SSS format */
export function getCurrentTime() {
  const now = new Date();

  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const ms = String(now.getMilliseconds()).padStart(3, '0');

  return `${h}:${m}:${s}.${ms}`;
}
