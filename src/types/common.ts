export interface Board {
  name: string;
  color: string;
  port: SerialPort;
}

export interface CustomInteractionModalProps {
  board: Board;
  onClose: () => void;
}
