import { Menu } from 'react-feather';
import { Board } from '../../types/common.ts';
import styles from './dashboard.module.css';
import Device from '../common/device.tsx';
import ButtonPanel from '../common/buttonPanel.tsx';
import { COLOR_BUTTON_GENERAL, COLOR_BUTTON_KILL } from '../../constants.ts';
import { ComponentType, useState } from 'react';
import SendKillModal from './sendKillModal.tsx';

interface DashboardProps {
  board: Board | null;
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const lookup = {
  'Send Kill': SendKillModal,
};

function Dashboard(props: DashboardProps) {
  const [isModalShown, setIsModalShown] = useState<boolean>(false);
  const [Modal, setModal] = useState<ComponentType<{
    board: Board;
    onClose: () => void;
  }> | null>(null);

  return (
    <>
      <div className={styles.dashboard}>
        {/* Header */}
        <div className={styles.header}>
          <span
            className={styles.menu}
            onClick={() => props.setIsSidebarExpanded(true)}
          >
            <Menu size={24} />
          </span>
          {props.board ? (
            <>
              <h1 className='fs-primary-heading font-monospace font-bold'>
                Control Panel
              </h1>
              <Device
                color={props.board.color}
                name={props.board.name}
                textColor={'black'}
              />
            </>
          ) : (
            <h1 className='fs-primary-heading font-monospace font-bold'>
              No Board Selected
            </h1>
          )}
        </div>

        {props.board && (
          <div className={styles.panels}>
            <ButtonPanel
              title={'General Operations'}
              buttons={[
                'Send Message',
                'Poll Messages',
                'List Network Devices',
              ]}
              onClick={(button) => {
                console.log(button);
              }}
              buttonColor={COLOR_BUTTON_GENERAL}
            />

            <ButtonPanel
              title={'Kill Operations'}
              buttons={['Send Kill', 'Listen For Kill']}
              onClick={(button) => {
                setModal(() => lookup[button as keyof typeof lookup]);
                setIsModalShown(true);
              }}
              buttonColor={COLOR_BUTTON_KILL}
            />
          </div>
        )}
      </div>

      {props.board && isModalShown && Modal && (
        <Modal
          board={props.board}
          onClose={() => {
            setIsModalShown(false);
          }}
        />
      )}
    </>
  );
}

export default Dashboard;
