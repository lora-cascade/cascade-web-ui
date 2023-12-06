import { useState } from 'react';
import { CustomInteractionModalProps } from '../../types/common.ts';
import { getCurrentTime } from '../../utils/common.ts';
import { listenForKillMessages } from '../../utils/serialCommands.ts';
import InteractionModal from '../common/interactionModal.tsx';
import styles from './customInteractionModal.module.css';

function ListenForKillModal(props: CustomInteractionModalProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [stopListening, setStopListening] = useState<() => Promise<boolean>>(
    () => Promise.resolve(false),
  );

  return (
    <InteractionModal
      title={'Listen For Kill'}
      logs={logs}
      canClose={!isListening && !isWaiting}
      onClose={props.onClose}
    >
      <div className={styles.controls}>
        <button
          className={styles.sendButton}
          onClick={async () => {
            if (!isListening && !isWaiting) {
              setIsListening(true);
              setIsWaiting(true);
              const stop = await listenForKillMessages(
                props.board.port,
                (isKill) => {
                  const message = `[${getCurrentTime()}]\t Received Kill ${
                    isKill ? 'Enable' : 'Disable'
                  }`;

                  setLogs((logs) => {
                    return [message, ...logs];
                  });
                },
              );
              setIsWaiting(false);
              setStopListening(() => stop);
            } else if (!isWaiting) {
              setIsWaiting(true);
              const isSuccess = await stopListening();
              setIsWaiting(false);
              setIsListening(false);

              const message = `[${getCurrentTime()}]\t ${
                isSuccess ? 'SUCCESS' : 'FAILURE'
              }: Stop Listening`;
              setLogs((logs) => {
                return [message, ...logs];
              });
            }
          }}
        >
          <span className={'font-sans'}>
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </span>
        </button>
      </div>
    </InteractionModal>
  );
}

export default ListenForKillModal;
