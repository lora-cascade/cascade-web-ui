import { clearIntervalAsync, setIntervalAsync } from 'set-interval-async/fixed';
import {
  KILL_POLL_RATE_MS,
  LIST_NETWORK_DEVICES_COMMAND_CODE,
  LISTEN_FOR_KILL_MESSAGES_COMMAND_CODE,
  MAX_POLL_RETRIES,
  POLL_MESSAGES_COMMAND_CODE,
  SEND_KILL_MESSAGE_COMMAND_CODE,
  SEND_MESSAGE_COMMAND_CODE,
  SERIAL_END_OF_KILL_STATUS,
  SERIAL_FALSE,
  SERIAL_TRUE,
  STOP_LISTENING_FOR_KILL_MESSAGES_COMMAND_CODE,
  USB_BAUD_RATE,
  USB_POLL_RATE_MS,
} from '../constants.ts';
import { isPrintableASCII, sleep, stringToBytes, toByte } from './common.ts';
import {
  flushOutput,
  receiveBytes,
  sendBytes,
  tryClosePort,
} from './webSerial.ts';

/** General send and receive function to send a payload and receive a response from the board */
async function sendAndReceive(
  port: SerialPort,
  payload: Uint8Array,
): Promise<Uint8Array> {
  // Open serial port
  await port.open({ baudRate: USB_BAUD_RATE });

  // Flush device output
  await flushOutput(port);

  // Send command to device
  await sendBytes(port, payload);

  // Wait until device responds
  let received: Uint8Array = new Uint8Array();
  let retryCount = 0;
  while (received.length === 0 && retryCount++ < MAX_POLL_RETRIES) {
    await sleep(USB_POLL_RATE_MS);
    received = await receiveBytes(port);
  }

  // Close serial port
  await port.close();

  return received;
}

/** Send message to a specified receiver */
export async function sendMessage(
  port: SerialPort,
  receiverId: number,
  message: string,
): Promise<boolean> {
  // Verify that the message is valid
  if (message.length > 255 || !isPrintableASCII(message)) return false;
  // Verify that the receiverId is valid
  if (receiverId < 0 || receiverId > 255) return false;

  // Command + Receiver + MessageLength + Message
  const payload = new Uint8Array(1 + 1 + 1 + message.length);
  payload[0] = SEND_MESSAGE_COMMAND_CODE;
  payload[1] = toByte(receiverId);
  payload[2] = toByte(message.length);
  payload.set(stringToBytes(message), 3);
  console.log('SENT:', payload);

  try {
    const received = await sendAndReceive(port, payload);
    console.log('RECEIVED:', received);

    // Once the device responds, verify success
    return received[0] === SERIAL_TRUE;
  } catch (e) {
    console.error(e);
    await tryClosePort(port);
    return false;
  }
}

/** Poll for stored messages from specified serial port */
export async function pollMessages(port: SerialPort): Promise<Uint8Array[]> {
  const payload = new Uint8Array([POLL_MESSAGES_COMMAND_CODE]);
  const polledMessages: Uint8Array[] = [];
  console.log('SENT:', payload);

  try {
    const received = await sendAndReceive(port, payload);
    console.log('RECEIVED:', received);

    // Once the device responds, separate response messages
    const numMessages = received[0];
    let currIndex = 1;

    for (let i = 0; i < numMessages; i++) {
      const messageLength = received[currIndex++];
      const message = new Uint8Array(messageLength);

      for (let j = 0; j < messageLength; j++) {
        message[j] = received[currIndex + j];
      }

      polledMessages.push(message);
      currIndex += messageLength;
    }

    return polledMessages;
  } catch (e) {
    console.error(e);
    await tryClosePort(port);
    return [];
  }
}

/** Request a list of devices currently in the mesh network from specified serial port */
export async function listNetworkDevices(
  port: SerialPort,
): Promise<Uint8Array> {
  const payload = new Uint8Array([LIST_NETWORK_DEVICES_COMMAND_CODE]);
  console.log('SENT:', payload);

  try {
    const received = await sendAndReceive(port, payload);
    console.log('RECEIVED:', received);

    // Once the device responds, return devices
    const numDevices = received[0];
    const devices = new Uint8Array(numDevices);

    for (let i = 0; i < numDevices; i++) {
      devices[i] = received[1 + i];
    }

    return devices;
  } catch (e) {
    console.error(e);
    await tryClosePort(port);
    return new Uint8Array();
  }
}

/** Send a kill message to specified serial port */
export async function sendKillMessage(
  port: SerialPort,
  isKill: boolean,
): Promise<boolean> {
  const payload = new Uint8Array([
    SEND_KILL_MESSAGE_COMMAND_CODE,
    isKill ? SERIAL_TRUE : SERIAL_FALSE,
  ]);
  console.log('SENT:', payload);

  try {
    const received = await sendAndReceive(port, payload);
    console.log('RECEIVED:', received);

    // Once the device responds, verify success
    return received[0] === SERIAL_TRUE;
  } catch (e) {
    console.error(e);
    await tryClosePort(port);
    return false;
  }
}

/**
 * Listen for current kill status of specified serial port.
 * Calls callback for every new kill status from device.
 * Returns function to stop listening for kill messages.
 */
export async function listenForKillMessages(
  port: SerialPort,
  callback: (isKill: boolean) => void,
): Promise<() => Promise<boolean>> {
  const payload = new Uint8Array([LISTEN_FOR_KILL_MESSAGES_COMMAND_CODE]);

  try {
    await port.open({ baudRate: USB_BAUD_RATE });

    // Flush device output
    await flushOutput(port);

    // Send command to device
    await sendBytes(port, payload);

    // Repeatedly poll device until we stop listening for kill messages
    const intervalId = setIntervalAsync(async () => {
      const received = await receiveBytes(port);
      if (received.length > 0) {
        callback(received.includes(SERIAL_TRUE));
      }
    }, KILL_POLL_RATE_MS);

    return async () => {
      await clearIntervalAsync(intervalId);
      return await stopListeningForKillMessages(port);
    };
  } catch (e) {
    console.error(e);
    await tryClosePort(port);
    return () => Promise.resolve(false);
  }
}

/** Stop listening for current kill status of specified serial port */
async function stopListeningForKillMessages(
  port: SerialPort,
): Promise<boolean> {
  const payload = new Uint8Array([
    STOP_LISTENING_FOR_KILL_MESSAGES_COMMAND_CODE,
  ]);

  try {
    // Send command to device
    await sendBytes(port, payload);

    // Wait until device responds
    let received: Uint8Array = new Uint8Array();
    let retryCount = 0;
    while (
      !received.includes(SERIAL_END_OF_KILL_STATUS) &&
      retryCount++ < MAX_POLL_RETRIES
    ) {
      await sleep(USB_POLL_RATE_MS);
      received = await receiveBytes(port);
    }

    await port.close();

    return received.includes(SERIAL_END_OF_KILL_STATUS);
  } catch (e) {
    console.error(e);
    await tryClosePort(port);
    return false;
  }
}
