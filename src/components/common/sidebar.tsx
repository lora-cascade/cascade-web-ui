import { Board } from '../../types/common';
import Device from './device';
import styles from './sidebar.module.css';
import { Plus, X } from 'react-feather';

interface SidebarProps {
  boards: Board[];
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBoard: Board | null;
  setSelectedBoard: React.Dispatch<React.SetStateAction<Board | null>>;
  setIsAddBoardModalShown: React.Dispatch<React.SetStateAction<boolean>>;
}

function Sidebar(props: SidebarProps) {
  const sidebarClasses =
    styles.sidebar + (props.isSidebarExpanded ? ` ${styles.fullscreen}` : '');

  return (
    <div className={sidebarClasses}>
      <span className={styles.sidebarHeader}>
        <h2 className='fs-secondary-heading font-monospace'>Connections</h2>
        {props.isSidebarExpanded && (
          <X
            size={24}
            className={styles.close}
            onClick={() => props.setIsSidebarExpanded(false)}
          />
        )}
      </span>

      <ul>
        {props.boards &&
          props.boards.map((item, index) => (
            <li
              onClick={() => {
                props.setSelectedBoard(item);
                props.setIsSidebarExpanded(false);
              }}
              key={index}
              className={styles.device}
            >
              <Device name={item.name} color={item.color} />
            </li>
          ))}
      </ul>

      <div
        onClick={() => props.setIsAddBoardModalShown(true)}
        className={styles.addDevice}
      >
        <Plus color='white' size={24} />
      </div>
    </div>
  );
}

export default Sidebar;
