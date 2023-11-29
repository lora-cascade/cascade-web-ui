import {
  LILY_LORA_USB_PRODUCT_ID,
  LILY_LORA_USB_VENDOR_ID,
  USB_POLL_RATE_MS,
} from '../constants.ts';
import { sleep } from './common.ts';

const filters: SerialPortFilter[] = [
  {
    usbVendorId: LILY_LORA_USB_VENDOR_ID,
    usbProductId: LILY_LORA_USB_PRODUCT_ID,
  },
];

export async function getSerialPort(): Promise<SerialPort> {
  return await navigator.serial.requestPort({ filters });
}

export async function sendBytes(port: SerialPort, data: Uint8Array) {
  if (port.writable) {
    const writer = port.writable.getWriter();
    await writer.write(data);
    writer.releaseLock();
  } else {
    console.error(
      'Port not writable... Check if the UI is open in another tab!',
    );
  }
}

export async function flushOutput(port: SerialPort): Promise<void> {
  let timedOut = false;
  while (port.readable && !timedOut) {
    const reader = port.readable.getReader();

    try {
      const raceResult = await Promise.race([
        reader.read(),
        sleep(USB_POLL_RATE_MS),
      ]);

      if (
        !raceResult ||
        !Object.prototype.hasOwnProperty.call(raceResult, 'value')
      ) {
        timedOut = true;
        reader.cancel();
      }
    } catch (e) {
      console.error(e);
    } finally {
      reader.releaseLock();
    }
  }
}

export async function receiveBytes(port: SerialPort): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];

  let timedOut = false;
  while (port.readable && !timedOut) {
    const reader = port.readable.getReader();

    try {
      for (;;) {
        const raceResult = await Promise.race([
          reader.read(),
          sleep(USB_POLL_RATE_MS),
        ]);

        if (
          raceResult &&
          Object.prototype.hasOwnProperty.call(raceResult, 'value')
        ) {
          const { value, done } = raceResult;

          if (done) {
            break;
          }

          if (value) {
            chunks.push(value);
          }
        } else {
          timedOut = true;
          reader.cancel();
          break;
        }
      }
    } catch (e) {
      // TODO: figure out what to do if error
      console.error(e);
    } finally {
      reader.releaseLock();
    }
  }

  const combinedChunksLength = chunks.reduce(
    (acc, chunk) => acc + chunk.length,
    0,
  );

  const combinedChunks = new Uint8Array(combinedChunksLength);
  let offset = 0;
  for (const chunk of chunks) {
    combinedChunks.set(chunk, offset);
    offset += chunk.length;
  }

  return combinedChunks;
}
