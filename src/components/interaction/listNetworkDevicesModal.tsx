import { useState } from 'react';
import { CustomInteractionModalProps } from '../../types/common.ts';
import { getCurrentTime } from '../../utils/common.ts';
import { listNetworkDevices } from '../../utils/serialCommands.ts';
import InteractionModal from '../common/interactionModal.tsx';
import styles from './customInteractionModal.module.css';

function ListNetworkDevicesModal(props: CustomInteractionModalProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  return (
    <InteractionModal
      title={'List Network Devices'}
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
              const devices = await listNetworkDevices(props.board.port);
              setIsWaiting(false);

              const message = `[${getCurrentTime()}]\t Found ${
                devices.length
              } devices: ${devices.join(', ')}`;

              setLogs((logs) => {
                return [message, ...logs];
              });
            }
          }}
        >
          <span className={'font-sans'}>Request Devices</span>
        </button>
      </div>
    </InteractionModal>
  );
}

export default ListNetworkDevicesModal;
