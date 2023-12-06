import { useState } from 'react';
import ReactSwitch from 'react-switch';
import { CustomInteractionModalProps } from '../../types/common.ts';
import { getCurrentTime } from '../../utils/common.ts';
import { sendKillMessage } from '../../utils/serialCommands.ts';
import InteractionModal from '../common/interactionModal.tsx';
import styles from './customInteractionModal.module.css';

function SendKillModal(props: CustomInteractionModalProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isKill, setIsKill] = useState<boolean>(true);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  return (
    <InteractionModal
      title={'Send Kill Message'}
      logs={logs}
      canClose={!isWaiting}
      onClose={props.onClose}
    >
      <div className={styles.controls}>
        <label className={styles.switch}>
          <span>Disable Kill</span>
          <ReactSwitch
            checkedIcon={false}
            uncheckedIcon={false}
            onColor={'#5f263d'}
            offColor={'#26265f'}
            checked={isKill}
            onChange={(checked) => {
              setIsKill(checked);
            }}
          />
          <span>Enable Kill</span>
        </label>
        <button
          className={styles.sendButton}
          onClick={async () => {
            if (!isWaiting) {
              setIsWaiting(true);
              const isSuccess = await sendKillMessage(props.board.port, isKill);
              setIsWaiting(false);

              const message = `[${getCurrentTime()}]\t ${
                isSuccess ? 'SUCCESS' : 'FAILURE'
              }: ${isKill ? 'Enable Kill' : 'Disable Kill'}`;

              setLogs((logs) => {
                return [message, ...logs];
              });
            }
          }}
        >
          <span className={'font-sans'}>Send Message</span>
        </button>
      </div>
    </InteractionModal>
  );
}

export default SendKillModal;
