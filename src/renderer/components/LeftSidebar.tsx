import type React from 'react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { type WindowRecord, windowManager } from '../lib/window-manager';
import {
  homeButton,
  homeIcon,
  homeText,
  noWindows,
  sidebar,
  sidebarContent,
  sidebarHeader,
  sidebarHome,
  sidebarTitle,
  windowClose,
  windowCount,
  windowIcon,
  windowItem,
  windowList,
  windowTitle,
} from '../styles/goober';

interface LeftSidebarProps {
  isOpen: boolean;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ isOpen }) => {
  const [windows, setWindows] = useState<WindowRecord[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = windowManager.subscribe((records) => {
      setWindows(records);
      const active = records.find((r) => r.isActive);
      setActiveId(active?.id || null);
    });
    return unsubscribe;
  }, []);

  const handleWindowClick = (id: string) => {
    windowManager.toggle(id);
  };

  const handleClose = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    windowManager.close(id);
  };

  const handleMinimizeAll = () => {
    windowManager.minimizeAll();
  };

  return (
    <aside className={sidebar(isOpen)}>
      <div className={sidebarHeader}>
        <span className={sidebarTitle}>Windows</span>
        <span className={windowCount}>{windows.length}</span>
      </div>
      <div className={sidebarHome}>
        <button className={homeButton} onClick={handleMinimizeAll} title="Minimize All Windows">
          <span className={homeIcon}>⌂</span>
          <span className={homeText}>Minimize All</span>
        </button>
      </div>
      <div className={sidebarContent}>
        {windows.length === 0 ? (
          <div className={noWindows}>No open windows</div>
        ) : (
          <ul className={windowList}>
            {windows.map((record) => (
              <li
                key={record.id}
                className={clsx(
                  windowItem(activeId === record.id, record.isMinimized)
                )}
                onClick={() => handleWindowClick(record.id)}
              >
                <span className={windowIcon}>{record.isMinimized ? '◱' : '■'}</span>
                <span className={windowTitle} title={record.title}>
                  {record.title}
                </span>
                <button
                  className={windowClose}
                  onClick={(e) => handleClose(e, record.id)}
                  title="Close"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default LeftSidebar;
