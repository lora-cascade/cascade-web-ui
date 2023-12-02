import { useEffect, useRef, useState } from 'react';
import { X } from 'react-feather';
import toast from 'react-hot-toast';
import { USB_BAUD_RATE } from '../../constants.ts';
import { Board } from '../../types/common.ts';
import { flushOutput, getSerialPort } from '../../utils/webSerial.ts';
import styles from './addBoardModal.module.css';

interface AddBoardModalProps {
  setIsAddBoardModalShown: React.Dispatch<React.SetStateAction<boolean>>;
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
}

const colors = Object.freeze([
  '#ff8080',
  '#ffbf80',
  '#80ff80',
  '#80bfff',
  '#8080ff',
  '#ff80ff',
]);

function AddBoardModal(props: AddBoardModalProps) {
  const [name, setName] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  async function onSubmit() {
    let port: SerialPort;

    try {
      port = await getSerialPort();
      await port.open({ baudRate: USB_BAUD_RATE });
      await flushOutput(port);
      await port.close();
    } catch (e) {
      // User probably exited out of the menu, they can submit again
      console.error(e);
      return;
    }

    props.setBoards((boards) => {
      let colorIndex = 0;

      if (boards.length !== 0) {
        colorIndex = boards.length % colors.length;
      }

      return [
        ...boards,
        {
          name: name,
          color: colors[colorIndex],
          port: port,
        },
      ];
    });

    props.setIsAddBoardModalShown(false);
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.addBoardModal}>
        {/*Header*/}
        <span className={styles.modalHeader}>
          <h2 className='fs-secondary-heading font-monospace'>Add Board</h2>
          <button
            className={styles.close}
            onClick={() => props.setIsAddBoardModalShown(false)}
          >
            <X size={24} />
          </button>
        </span>

        {/*Form*/}
        <form
          className={styles.modalInputs}
          onSubmit={async (e) => {
            e.preventDefault();
            if (name.length > 0) {
              void (await onSubmit());
            } else {
              toast.error('Must provide a board name', {
                id: 'add-board-name-error',
              });
            }
          }}
        >
          <div className={styles.textInputLabelContainer}>
            <div>Name *</div>
            <input
              type='text'
              onChange={(e) => setName(e.target.value)}
              ref={nameRef}
              className={styles.boardNameInput}
            />
          </div>
          <button className={styles.submit}>Add</button>
        </form>
      </div>
    </div>
  );
}

export default AddBoardModal;
