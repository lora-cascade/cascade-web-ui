import { Menu } from 'react-feather';
import { Board } from '../../types/common';
import styles from './dashboard.module.css';
import Device from './device';
import Panel from './panel';

interface DashboardProps {
  board: Board | null;
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

function Dashboard(props: DashboardProps) {
  return (
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

      {/* Dashboard */}
      {props.board ? <Panel /> : null}
    </div>
  );
}

export default Dashboard;

