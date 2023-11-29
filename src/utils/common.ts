export function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

export function isPrintableASCII(str: string): boolean {
  return /^[\x20-\x7E]*$/.test(str);
}

export function toByte(num: number): number {
  return num & 0xff;
}

export function stringToBytes(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}
