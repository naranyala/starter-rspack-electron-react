import { css, glob } from 'goober';

// Theme configuration
export const theme = {
  colors: {
    bgPrimary: '#0a0c11',
    bgSecondary: '#121826',
    bgTertiary: '#1a2233',
    textPrimary: '#f3f6ff',
    textSecondary: '#9aa4b6',
    borderColor: '#253047',
    cardBg: '#111827',
    cardHover: '#182235',
    cardBorder: '#24314b',
    accentColor: '#36d7b7',
    accentHover: '#5eead4',
    highlightBg: '#ffd166',
    highlightText: '#121212',
    footerBg: '#0f1522',
    winboxBg: '#0f1522',
    winboxBorder: '#29344f',
  },
  shadows: {
    default: '0 14px 30px rgba(5, 10, 20, 0.45)',
    hover: '0 20px 46px rgba(5, 10, 20, 0.6)',
    winbox: '0 12px 28px rgba(6, 12, 22, 0.6)',
  },
  gradients: {
    gradient1: 'linear-gradient(135deg, #36d7b7 0%, #2f80ed 100%)',
    gradient2: 'linear-gradient(135deg, #ff6b6b 0%, #ffd166 100%)',
    gradient3: 'linear-gradient(135deg, #5eead4 0%, #8b5cf6 100%)',
  },
  typography: {
    ui: '"Space Grotesk", "Segoe UI", "Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", "SF Mono", Consolas, monospace',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1200px',
    desktop: '1400px',
  },
  sidebar: {
    width: '220px',
    widthMobile: '200px',
  },
};

export const applyGlobalStyles = () => {
  glob`
    :root {
      --sidebar-width: ${theme.sidebar.width};
      --sidebar-collapsed: 0px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    *::before,
    *::after {
      box-sizing: border-box;
    }

    html,
    body,
    #root {
      height: 100%;
      width: 100%;
    }

    body {
      font-family: ${theme.typography.ui};
      background: ${theme.colors.bgPrimary};
      color: ${theme.colors.textPrimary};
      font-size: 14px;
      line-height: 1.4;
      -webkit-font-smoothing: antialiased;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    #root {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    ol,
    ul {
      list-style: none;
    }

    button,
    input,
    textarea,
    select {
      font: inherit;
      color: inherit;
    }

    /* Scrollbar styling */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: ${theme.colors.bgSecondary};
    }

    ::-webkit-scrollbar-thumb {
      background: ${theme.colors.borderColor};
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #4a4a4a;
    }

    /* WinBox styling */
    .wb-body {
      padding: 0 !important;
      background: transparent !important;
    }

    .winbox-content {
      padding: 16px;
      height: calc(100% - 35px);
      overflow-y: auto;
      color: ${theme.colors.textPrimary};
      background: ${theme.colors.bgSecondary} !important;
      line-height: 1.6;
      font-size: 0.9rem;
    }

    .winbox-content h3 {
      margin: 0 0 12px;
      font-size: 1.1rem;
      font-weight: 600;
      border-bottom: 2px solid ${theme.colors.accentColor};
      padding-bottom: 8px;
    }

    .winbox-content h4 {
      margin: 16px 0 8px;
      font-size: 0.95rem;
      font-weight: 600;
    }

    .winbox-content p {
      margin-bottom: 12px;
      color: ${theme.colors.textSecondary};
    }

    .winbox-content ul {
      margin: 0 0 12px 20px;
    }

    .winbox-content li {
      margin-bottom: 6px;
      color: ${theme.colors.textSecondary};
    }

    .winbox-content code {
      background: ${theme.colors.bgTertiary};
      padding: 2px 6px;
      border-radius: 4px;
      font-family: ${theme.typography.mono};
      font-size: 0.85em;
      color: ${theme.colors.accentColor};
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    mark {
      background: linear-gradient(135deg, ${theme.colors.highlightBg}, #f59e0b);
      color: ${theme.colors.highlightText};
      padding: 2px 4px;
      border-radius: 4px;
      font-weight: 700;
      box-shadow: 0 2px 4px rgba(251, 191, 36, 0.3);
    }

    @media (max-width: ${theme.breakpoints.mobile}) {
      :root {
        --sidebar-width: ${theme.sidebar.widthMobile};
      }

      #root {
        padding: 12px;
      }
    }
  `;
};

// App container styles
export const appContainer = css`
  font-family: ${theme.typography.ui};
  background: ${theme.colors.bgPrimary};
  background-image:
    linear-gradient(120deg, rgba(54, 215, 183, 0.08), transparent 40%),
    radial-gradient(circle at 10% 20%, rgba(94, 234, 212, 0.15) 0%, transparent 55%),
    radial-gradient(circle at 90% 10%, rgba(79, 70, 229, 0.18) 0%, transparent 60%),
    radial-gradient(circle at 70% 85%, rgba(255, 107, 107, 0.1) 0%, transparent 60%),
    linear-gradient(transparent 24px, rgba(37, 48, 71, 0.28) 25px),
    linear-gradient(90deg, transparent 24px, rgba(37, 48, 71, 0.28) 25px);
  background-size: auto, auto, auto, auto, 48px 48px, 48px 48px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: ${theme.colors.textPrimary};
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  position: relative;
`;

// Main content area
export const mainContent = (isSidebarOpen: boolean) => css`
  margin-left: ${isSidebarOpen ? theme.sidebar.width : '0'};
  transition: margin-left 0.3s ease;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;

  @media (max-width: ${theme.breakpoints.mobile}) {
    margin-left: 0;
  }
`;

export const header = css`
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(18, 24, 38, 0.9), rgba(26, 34, 51, 0.85));
  border-bottom: 1px solid rgba(37, 48, 71, 0.7);
  box-shadow: 0 8px 20px rgba(5, 10, 20, 0.35);
  display: flex;
  align-items: center;
  gap: 12px;
  backdrop-filter: blur(10px);
`;

export const headerContent = css`
  flex: 1;
  text-align: center;
`;

export const headerTitle = css`
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0 0 2px;
  color: ${theme.colors.textPrimary};
  letter-spacing: 0.01em;
`;

export const headerSubtitle = css`
  font-size: 0.88rem;
  color: ${theme.colors.textSecondary};
  margin: 0;
`;

export const mainArea = css`
  flex: 1;
  padding: 20px;
  width: 100%;
  max-width: 100%;
`;

// Search container
export const searchContainer = css`
  margin: 6px 0 14px;
  text-align: center;
  width: 100%;
`;

// Search input
export const searchInput = css`
  width: 100%;
  max-width: 520px;
  display: block;
  margin: 0 auto;
  padding: 12px 16px;
  font-size: 0.9rem;
  border: 1px solid rgba(54, 215, 183, 0.22);
  border-radius: 999px;
  box-sizing: border-box;
  transition: border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
  background-color: rgba(18, 24, 38, 0.85);
  color: ${theme.colors.textPrimary};
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accentColor};
    box-shadow: 0 0 0 3px rgba(54, 215, 183, 0.2);
    background-color: rgba(26, 34, 51, 0.95);
  }

  &::placeholder {
    color: ${theme.colors.textSecondary};
  }
`;

export const tabFilter = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 14px 0 18px;
`;

export const tabButton = (isActive: boolean) => css`
  padding: 8px 14px;
  font-size: 0.78rem;
  font-weight: 500;
  border: 1px solid ${isActive ? 'rgba(54, 215, 183, 0.45)' : theme.colors.borderColor};
  border-radius: 999px;
  background: ${isActive ? 'rgba(54, 215, 183, 0.12)' : theme.colors.bgSecondary};
  color: ${isActive ? theme.colors.textPrimary : theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${isActive ? 'rgba(54, 215, 183, 0.2)' : theme.colors.bgTertiary};
    color: ${theme.colors.textPrimary};
    border-color: rgba(54, 215, 183, 0.45);
  }
`;

// Cards list container
export const cardsList = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
  animation: fadeInUp 0.6s ease-out;

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  @media (min-width: 768px) and (max-width: 1199px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
`;

// Card component
export const card = css`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${theme.colors.cardBg};
  border-radius: 12px;
  padding: 16px 16px;
  box-shadow: none;
  transition: border-color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;
  border: 1px solid ${theme.colors.cardBorder};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.5s ease-out backwards;

  &:hover {
    transform: translateY(-1px);
    background-color: ${theme.colors.cardHover};
    border-color: rgba(54, 215, 183, 0.6);
  }
`;

export const cardContent = css`
  flex: 1;
  min-width: 0;
`;

// Card title
export const cardTitle = css`
  font-size: 1rem;
  font-weight: 650;
  color: ${theme.colors.textPrimary};
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const cardTag = css`
  display: inline-block;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${theme.colors.textSecondary};
  background: rgba(17, 24, 39, 0.7);
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid rgba(37, 48, 71, 0.9);
`;

export const cardArrow = css`
  font-size: 1rem;
  color: rgba(154, 164, 182, 0.7);
  flex-shrink: 0;
  transition:
    transform 0.2s,
    color 0.2s;
`;

export const cardWithArrow = css`
  &:hover .${cardArrow} {
    transform: translateX(2px);
    color: ${theme.colors.accentColor};
  }
`;

// No results message
export const noResults = css`
  text-align: center;
  padding: 40px 20px;
  font-size: 0.95rem;
  color: ${theme.colors.textSecondary};
  background: rgba(18, 24, 38, 0.8);
  border-radius: 14px;
  border: 1px dashed rgba(54, 215, 183, 0.25);
  margin: 16px 0;
  font-weight: 500;
`;

// Footer
export const footer = css`
  background-color: ${theme.colors.footerBg};
  background-image: linear-gradient(180deg, rgba(15, 21, 34, 0.9) 0%, ${theme.colors.bgTertiary} 100%);
  padding: 12px 16px;
  border-top: 1px solid rgba(37, 48, 71, 0.8);
  margin-top: auto;
  backdrop-filter: blur(10px);
  text-align: center;

  p {
    margin: 0;
    color: ${theme.colors.textSecondary};
    font-size: 0.8rem;
  }

  code {
    background-color: ${theme.colors.bgTertiary};
    padding: 2px 5px;
    border-radius: 3px;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    color: ${theme.colors.accentColor};
    font-size: 0.75em;
  }
`;

// Sidebar toggle button (mobile only)
export const sidebarToggle = css`
  background: rgba(18, 24, 38, 0.8);
  border: 1px solid rgba(54, 215, 183, 0.35);
  color: ${theme.colors.textPrimary};
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  &:hover {
    background: rgba(26, 34, 51, 0.9);
    border-color: rgba(54, 215, 183, 0.6);
  }
`;

// Sidebar
export const sidebar = (isOpen: boolean) => css`
  position: fixed;
  left: ${isOpen ? '0' : '-100%'};
  top: 0;
  bottom: 0;
  width: ${theme.sidebar.width};
  background: ${theme.colors.bgSecondary};
  border-right: 1px solid ${theme.colors.borderColor};
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transition: left 0.3s ease;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: ${theme.sidebar.widthMobile};
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
    left: ${isOpen ? '0' : `-${theme.sidebar.widthMobile}`};
  }

  @media (min-width: ${theme.breakpoints.mobile}) {
    left: 0;
    animation: none;
  }
`;

// Sidebar header
export const sidebarHeader = css`
  padding: 16px 20px;
  border-bottom: 1px solid ${theme.colors.borderColor};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${theme.colors.bgTertiary};
`;

export const sidebarTitle = css`
  font-weight: 600;
  font-size: 14px;
  color: ${theme.colors.textPrimary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const windowCount = css`
  background: ${theme.colors.accentColor};
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
`;

// Sidebar home button
export const sidebarHome = css`
  padding: 12px;
  border-bottom: 1px solid ${theme.colors.borderColor};
`;

export const homeButton = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 12px;
  background: ${theme.colors.accentColor};
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.accentHover};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(129, 140, 248, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const homeIcon = css`
  font-size: 16px;
`;

export const homeText = css`
  font-size: 13px;
`;

// Sidebar content
export const sidebarContent = css`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
`;

export const noWindows = css`
  text-align: center;
  color: ${theme.colors.textSecondary};
  font-size: 13px;
  padding: 20px;
  opacity: 0.7;
`;

// Window list
export const windowList = css`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const windowItem = (isActive: boolean, isMinimized: boolean) => css`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 4px;
  background: ${isActive ? theme.colors.accentColor : theme.colors.cardBg};
  border: 1px solid ${isActive ? theme.colors.accentColor : theme.colors.cardBorder};
  opacity: ${isMinimized ? 0.7 : 1};

  &:hover {
    background: ${isActive ? theme.colors.accentColor : theme.colors.cardHover};
    border-color: ${theme.colors.accentColor};
  }

  &:hover .${windowClose} {
    opacity: 1;
  }
`;

export const windowIcon = css`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
  width: 20px;
  text-align: center;
  flex-shrink: 0;
`;

export const windowTitle = css`
  flex: 1;
  font-size: 13px;
  color: ${theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const windowClose = css`
  background: none;
  border: none;
  color: ${theme.colors.textSecondary};
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  opacity: 0;

  &:hover {
    background: rgba(248, 113, 113, 0.2);
    color: #f87171;
  }
`;
