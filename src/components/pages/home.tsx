import Dashboard from '../main/dashboard.tsx';
import Sidebar from '../main/sidebar.tsx';
import styles from './home.module.css';
import { Board } from '../../types/common';
import { useState } from 'react';
import AddBoardModal from '../main/addBoardModal.tsx';
import NoWebSerial from '../common/noWebSerial.tsx';

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

  // Check if the Web Serial API is supported in the current browser
  if (!('serial' in navigator)) {
    return <NoWebSerial />;
  }

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
