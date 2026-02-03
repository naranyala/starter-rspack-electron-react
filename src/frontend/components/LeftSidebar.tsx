import type React from 'react';
import { useEffect, useState } from 'react';
import { type WindowRecord, windowManager } from '../lib/window-manager';
import {
  Sidebar,
  SidebarHeader,
  SidebarTitle,
  WindowCount,
  SidebarHome,
  HomeButton,
  HomeIcon,
  HomeText,
  SidebarContent,
  NoWindows,
  WindowList,
  WindowItem,
  WindowIcon,
  WindowTitle,
  WindowClose,
} from '../styles/redesigned-styles';

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
    <>
      <Sidebar isOpen={isOpen}>
        <SidebarHeader>
          <SidebarTitle>Windows</SidebarTitle>
          <WindowCount>{windows.length}</WindowCount>
        </SidebarHeader>
        <SidebarHome>
          <HomeButton onClick={handleMinimizeAll} title="Go Home">
            <HomeIcon>⌂</HomeIcon>
            <HomeText>Home</HomeText>
          </HomeButton>
        </SidebarHome>
        <SidebarContent>
          {windows.length === 0 ? (
            <NoWindows>No open windows</NoWindows>
          ) : (
            <WindowList>
              {windows.map((record) => (
                <WindowItem
                  key={record.id}
                  isActive={activeId === record.id}
                  isMinimized={record.isMinimized}
                  onClick={() => handleWindowClick(record.id)}
                >
                  <WindowIcon>{record.isMinimized ? '◱' : '■'}</WindowIcon>
                  <WindowTitle title={record.title}>
                    {record.title}
                  </WindowTitle>
                  <WindowClose
                    onClick={(e) => handleClose(e, record.id)}
                    title="Close"
                  >
                    ×
                  </WindowClose>
                </WindowItem>
              ))}
            </WindowList>
          )}
        </SidebarContent>
      </Sidebar>
    </>
  );
};

export default LeftSidebar;
