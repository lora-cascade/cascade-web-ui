import { ComponentType, useState } from 'react';
import { Menu } from 'react-feather';
import { COLOR_BUTTON_GENERAL, COLOR_BUTTON_KILL } from '../../constants.ts';
import { Board } from '../../types/common.ts';
import ButtonPanel from '../common/buttonPanel.tsx';
import Device from '../common/device.tsx';
import ListenForKillModal from '../interaction/listenForKillModal.tsx';
import ListNetworkDevicesModal from '../interaction/listNetworkDevicesModal.tsx';
import PollMessagesModal from '../interaction/pollMessagesModal.tsx';
import SendKillModal from '../interaction/sendKillModal.tsx';
import SendMessageModal from '../interaction/sendMessageModal.tsx';
import styles from './dashboard.module.css';

interface DashboardProps {
  board: Board | null;
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const modalLookup = {
  'Send Message': SendMessageModal,
  'Poll Messages': PollMessagesModal,
  'List Network Devices': ListNetworkDevicesModal,
  'Send Kill': SendKillModal,
  'Listen For Kill': ListenForKillModal,
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
                setModal(() => modalLookup[button as keyof typeof modalLookup]);
                setIsModalShown(true);
              }}
              buttonColor={COLOR_BUTTON_GENERAL}
            />

            <ButtonPanel
              title={'Kill Operations'}
              buttons={['Send Kill', 'Listen For Kill']}
              onClick={(button) => {
                setModal(() => modalLookup[button as keyof typeof modalLookup]);
                setIsModalShown(true);
              }}
              buttonColor={COLOR_BUTTON_KILL}
            />
          </div>
        )}
      </div>

      {props.board && Modal && isModalShown && (
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
