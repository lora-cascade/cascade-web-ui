import { PropsWithChildren } from 'react';
import { X } from 'react-feather';
import styles from './interactionModal.module.css';

interface InteractionModalProps {
  title: string;
  logs: string[];
  canClose: boolean;
  onClose: () => void;
}

function InteractionModal(props: PropsWithChildren<InteractionModalProps>) {
  const closeClasses =
    styles.close + (props.canClose ? '' : ` ${styles.closeDisabled}`);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <span className={styles.modalHeader}>
          <h2 className={'fs-secondary-heading font-monospace'}>
            {props.title}
          </h2>
          <button
            className={closeClasses}
            onClick={() => {
              if (props.canClose) props.onClose();
            }}
          >
            <X size={24} />
          </button>
        </span>

        <div className={styles.logViewer}>
          <ul>
            {props.logs.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        </div>

        {props.children}
      </div>
    </div>
  );
}

export default InteractionModal;
