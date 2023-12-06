import { useState } from 'react';
import toast from 'react-hot-toast';
import { CustomInteractionModalProps } from '../../types/common.ts';
import { getCurrentTime } from '../../utils/common.ts';
import { sendMessage } from '../../utils/serialCommands.ts';
import InteractionModal from '../common/interactionModal.tsx';
import styles from './customInteractionModal.module.css';

const DEFAULT_RECEIVER_ID = 0;

function SendMessageModal(props: CustomInteractionModalProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [receiverId, setReceiverId] = useState<number | null>(
    DEFAULT_RECEIVER_ID,
  );
  const [message, setMessage] = useState<string>('');

  async function onSend() {
    if (receiverId === null) {
      toast.error('Must provide Receiver ID', {
        id: 'send-message-receiver-id-error',
      });
      return;
    }

    if (!isWaiting) {
      setIsWaiting(true);
      const isSuccess = await sendMessage(
        props.board.port,
        receiverId,
        message,
      );
      setIsWaiting(false);

      const logMessage = `[${getCurrentTime()}]\t ${
        isSuccess ? 'SUCCESS' : 'FAILURE'
      }: Send "${message}"`;

      setLogs((logs) => {
        return [logMessage, ...logs];
      });
    }
  }

  return (
    <InteractionModal
      title={'Send Message'}
      logs={logs}
      canClose={!isWaiting}
      onClose={props.onClose}
    >
      <form
        className={styles.controls}
        onSubmit={async (e) => {
          e.preventDefault();
          void (await onSend());
        }}
      >
        <span className={styles.sendMessageTextInputs}>
          <div className={styles.textInputLabelContainer}>
            <div>Receiver ID *</div>
            <input
              type={'number'}
              className={styles.textInput}
              onChange={(e) => {
                if (e.target.value.length === 0) {
                  setReceiverId(null);
                } else {
                  setReceiverId(Number(e.target.value));
                }
              }}
              defaultValue={DEFAULT_RECEIVER_ID}
            />
          </div>
          <div className={styles.textInputLabelContainer}>
            <div>Message</div>
            <input
              type={'text'}
              className={styles.textInput}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
          </div>
        </span>
        <button className={styles.sendButton}>Send Message</button>
      </form>
    </InteractionModal>
  );
}

export default SendMessageModal;
