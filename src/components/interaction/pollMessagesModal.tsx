import { useState } from 'react';
import { CustomInteractionModalProps } from '../../types/common.ts';
import { getCurrentTime } from '../../utils/common.ts';
import { pollMessages } from '../../utils/serialCommands.ts';
import InteractionModal from '../common/interactionModal.tsx';
import styles from './customInteractionModal.module.css';

function PollMessagesModal(props: CustomInteractionModalProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  return (
    <InteractionModal
      title={'Poll Messages'}
      logs={logs}
      canClose={!isWaiting}
      onClose={props.onClose}
    >
      <div className={styles.controls}>
        <button
          className={styles.sendButton}
          onClick={async () => {
            if (!isWaiting) {
              setIsWaiting(true);
              const byteArrays = await pollMessages(props.board.port);
              setIsWaiting(false);

              const messages = byteArrays.map((bytes, index) => {
                return `[${index + 1}]  ` + String.fromCharCode(...bytes);
              });

              const message = `[${getCurrentTime()}]\t Received ${
                messages.length
              } messages`;

              setLogs((logs) => {
                return [message, ...messages, ...logs];
              });
            }
          }}
        >
          <span className={'font-sans'}>Poll Messages</span>
        </button>
      </div>
    </InteractionModal>
  );
}

export default PollMessagesModal;
