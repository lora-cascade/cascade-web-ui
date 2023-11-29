import InteractionModal from '../common/interactionModal.tsx';
import { Board } from '../../types/common.ts';
import { useState } from 'react';
import { sendKillMessage } from '../../utils/serialCommands.ts';

interface SendKillModalProps {
  board: Board;
  onClose: () => void;
}

function SendKillModal(props: SendKillModalProps) {
  const [logs, setLogs] = useState<string[]>([]);

  return (
    <InteractionModal
      title={'Send Kill Message'}
      logs={logs}
      canClose={true}
      onClose={props.onClose}
    >
      <button
        onClick={async () => {
          const isSuccess = await sendKillMessage(props.board.port);
          const message = isSuccess ? 'SUCCESS' : 'FAILURE';

          setLogs((logs) => {
            return [...logs, message];
          });
        }}
      >
        send kill
      </button>
    </InteractionModal>
  );
}

export default SendKillModal;
