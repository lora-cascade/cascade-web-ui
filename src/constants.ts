/* Device constants */
export const LILY_LORA_USB_VENDOR_ID = 0x1a86;
export const LILY_LORA_USB_PRODUCT_ID = 0x55d4;
export const USB_BAUD_RATE = 115200;

/* Polling constants */
export const USB_POLL_RATE_MS = 20;
export const MAX_POLL_RETRIES = 100;

/* Serial constants */
export const SERIAL_TRUE = 0x01;
export const SERIAL_FALSE = 0x00;
export const SERIAL_END_OF_KILL_STATUS = 0x02;
export const SEND_MESSAGE_COMMAND_CODE = 0x00;
export const POLL_MESSAGES_COMMAND_CODE = 0x01;
export const LIST_NETWORK_DEVICES_COMMAND_CODE = 0x02;
export const SEND_KILL_MESSAGE_COMMAND_CODE = 0x03;
export const LISTEN_FOR_KILL_MESSAGES_COMMAND_CODE = 0x04;
export const STOP_LISTENING_FOR_KILL_MESSAGES_COMMAND_CODE = 0x05;

/* Color constants */
export const COLOR_BUTTON_GENERAL = '#c3e5ea';
export const COLOR_BUTTON_KILL = '#eac3c3';
