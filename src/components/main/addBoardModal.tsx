import { X } from 'react-feather';
import styles from './addBoardModal.module.css';
import { useEffect, useRef, useState } from 'react';
import { Board } from '../../types/common.ts';
import { flushOutput, getSerialPort } from '../../utils/webSerial.ts';
import { USB_BAUD_RATE } from '../../constants.ts';

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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void onSubmit();
        }}
      >
        <div className={styles.addBoardModal}>
          <span className={styles.modalHeader}>
            <h2 className='fs-secondary-heading font-monospace'>Add Board</h2>
            <X
              onClick={() => props.setIsAddBoardModalShown(false)}
              size={24}
              className={styles.close}
            />
          </span>
          <span className={styles.modalInputs}>
            <input
              type='text'
              onChange={(e) => setName(e.target.value)}
              placeholder='name'
              ref={nameRef}
              className={styles.boardNameInput}
            />
          </span>
          <button className={styles.submit}>Add</button>
        </div>
      </form>
    </div>
  );
}

export default AddBoardModal;
