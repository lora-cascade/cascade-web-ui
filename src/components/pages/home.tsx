import Dashboard from '../common/dashboard';
import Sidebar from '../common/sidebar';
import styles from './home.module.css';
import { Board } from '../../types/common';
import { useState } from 'react';
import AddBoardModal from '../common/addBoardModal';

function Home() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);
  const [isAddBoardModalShown, setIsAddBoardModalShown] =
    useState<boolean>(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);

  function handleResize() {
    if (isSidebarExpanded && window.innerWidth >= 768) {
      setIsSidebarExpanded(false);
    }
  }

  window.addEventListener('resize', handleResize);

  /* const boards: Board[] = [
    {
      name: 'board 1',
      color: '#CFA2DF',
    },
    {
      name: 'board 2',
      color: '#A2DFB3',
    },
  ]; */

  return (
    <div className={styles.container}>
      <Sidebar
        isSidebarExpanded={isSidebarExpanded}
        setIsSidebarExpanded={setIsSidebarExpanded}
        selectedBoard={selectedBoard}
        setSelectedBoard={setSelectedBoard}
        boards={boards}
        setBoards={setBoards}
        setIsAddBoardModalShown={setIsAddBoardModalShown}
      />

      {!isSidebarExpanded && (
        <Dashboard
          board={selectedBoard}
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
        />
      )}

      {isAddBoardModalShown && (
        <AddBoardModal
          setIsAddBoardModalShown={setIsAddBoardModalShown}
          setBoards={setBoards}
        />
      )}
    </div>
  );
}

export default Home;
