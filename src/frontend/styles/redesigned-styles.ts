import { styled, glob } from 'goober';

// Theme configuration (preserving sidebar colors)
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
      max-width: 100%;
      margin: 0;
      padding: 0;
      height: 100vh;
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

    /* WinBox styling - completely redesigned and fixed */
    .wb-window.custom-styled {
      border-radius: 16px !important;
      overflow: hidden;
      box-shadow: ${theme.shadows.winbox} !important;
      border: 1px solid ${theme.colors.winboxBorder} !important;
      background: ${theme.colors.winboxBg} !important;
      min-height: 200px !important;
    }

    .wb-window.custom-styled .wb-header {
      background: linear-gradient(135deg, #1a2233, #0f1522) !important;
      border-bottom: 1px solid ${theme.colors.borderColor} !important;
      padding: 12px 16px !important;
      border-radius: 16px 16px 0 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      min-height: 48px !important;
    }

    .wb-window.custom-styled .wb-title {
      font-family: ${theme.typography.ui} !important;
      font-weight: 600 !important;
      color: ${theme.colors.textPrimary} !important;
      font-size: 0.9rem !important;
      margin: 0 !important;
      flex: 1 !important;
      text-align: left !important;
      padding-right: 10px !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }

    .wb-window.custom-styled .wb-controls {
      display: flex !important;
      gap: 8px !important; /* Increased gap for better visibility */
      flex-shrink: 0 !important;
      padding: 0 2px 0 12px !important; /* Add padding to separate from title */
    }

    .wb-window.custom-styled .wb-control {
      background: rgba(255, 255, 255, 0.1) !important;
      border-radius: 6px !important;
      width: 32px !important;
      height: 32px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 14px !important;
      color: ${theme.colors.textSecondary} !important;
      transition: all 0.2s ease !important;
      cursor: pointer !important;
      border: none !important;
      padding: 0 !important;
      font-family: ${theme.typography.ui} !important;
      font-weight: bold !important;
      box-sizing: border-box !important;
      margin: 2px 0 !important; /* Add vertical margin for better spacing */
    }

    .wb-window.custom-styled .wb-control:hover {
      background: ${theme.colors.accentColor} !important;
      color: white !important;
      transform: scale(1.1) !important;
    }

    .wb-window.custom-styled .wb-control.wb-min {
      &::before {
        content: "−" !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        height: 100% !important;
      }
    }

    .wb-window.custom-styled .wb-control.wb-max {
      &::before {
        content: "□" !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        height: 100% !important;
      }
    }

    .wb-window.custom-styled .wb-control.wb-close {
      &::before {
        content: "×" !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        height: 100% !important;
      }
    }

    /* Different colors for different controls */
    .wb-window.custom-styled .wb-control.wb-min {
      &::before { content: "−" !important; }
    }

    .wb-window.custom-styled .wb-control.wb-max {
      &::before { content: "□" !important; }
    }

    .wb-window.custom-styled .wb-control.wb-close {
      background: rgba(248, 113, 113, 0.1) !important;
      &::before { content: "×" !important; }

      &:hover {
        background: #f87171 !important;
      }
    }

    .wb-body {
      padding: 0 !important;
      background: transparent !important;
      border-radius: 0 0 16px 16px !important;
      min-height: calc(100% - 48px) !important;
      height: calc(100% - 48px) !important;
    }

    .winbox-content {
      padding: 24px !important;
      height: 100% !important;
      width: 100% !important;
      overflow-y: auto !important;
      color: ${theme.colors.textPrimary} !important;
      background: ${theme.colors.bgSecondary} !important;
      line-height: 1.7 !important;
      font-size: 0.95rem !important;
      border-radius: 0 0 16px 16px !important;
      box-sizing: border-box !important;
    }

    .winbox-content h3 {
      margin: 0 0 16px !important;
      font-size: 1.2rem !important;
      font-weight: 700 !important;
      color: ${theme.colors.accentColor} !important;
      position: relative !important;
      padding-bottom: 12px !important;
    }

    .winbox-content h3::after {
      content: '' !important;
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      width: 50px !important;
      height: 2px !important;
      background: ${theme.colors.accentColor} !important;
      border-radius: 2px !important;
    }

    .winbox-content h4 {
      margin: 20px 0 10px !important;
      font-size: 1.05rem !important;
      font-weight: 600 !important;
      color: ${theme.colors.textPrimary} !important;
    }

    .winbox-content p {
      margin-bottom: 16px !important;
      color: ${theme.colors.textSecondary} !important;
      line-height: 1.7 !important;
    }

    .winbox-content ul {
      margin: 0 0 16px 24px !important;
      padding-left: 12px !important;
    }

    .winbox-content li {
      margin-bottom: 10px !important;
      color: ${theme.colors.textSecondary} !important;
      position: relative !important;
    }

    .winbox-content li::before {
      content: '•' !important;
      color: ${theme.colors.accentColor} !important;
      display: inline-block !important;
      width: 1em !important;
      margin-left: -1em !important;
    }

    .winbox-content code {
      background: ${theme.colors.bgTertiary} !important;
      padding: 3px 8px !important;
      border-radius: 6px !important;
      font-family: ${theme.typography.mono} !important;
      font-size: 0.85em !important;
      color: ${theme.colors.accentColor} !important;
      border: 1px solid rgba(54, 215, 183, 0.2) !important;
    }

    .winbox-content pre {
      background: ${theme.colors.bgTertiary} !important;
      padding: 16px !important;
      border-radius: 8px !important;
      overflow-x: auto !important;
      margin: 16px 0 !important;
      border: 1px solid rgba(54, 215, 183, 0.15) !important;
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

    @keyframes slideInFromLeft {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
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
        padding: 0;
        height: 100vh;
      }
    }
  `;
};

// App container component
export const AppContainer = styled('div')`
  font-family: ${theme.typography.ui};
  background: ${theme.colors.bgPrimary};
  background-image:
    radial-gradient(circle at 10% 20%, rgba(54, 215, 183, 0.15) 0%, transparent 55%),
    radial-gradient(circle at 90% 10%, rgba(94, 234, 212, 0.1) 0%, transparent 60%),
    radial-gradient(circle at 70% 85%, rgba(47, 128, 237, 0.12) 0%, transparent 60%),
    linear-gradient(135deg, rgba(18, 24, 38, 0.8), rgba(10, 12, 17, 0.9));
  min-height: 100vh;
  display: flex;
  flex-direction: row; /* Changed to row to accommodate sidebar */
  color: ${theme.colors.textPrimary};
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at center, rgba(54, 215, 183, 0.05) 0%, transparent 70%);
    pointer-events: none;
    z-index: -1;
  }
`;

// Main content area component
export const MainContent = styled('div')<{ isSidebarOpen: boolean }>`
  margin-left: ${(props) => (props.isSidebarOpen ? theme.sidebar.width : '0')};
  transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.isSidebarOpen ? `calc(100% - ${theme.sidebar.width})` : '100%')};
  max-width: ${(props) => (props.isSidebarOpen ? `calc(100% - ${theme.sidebar.width})` : '100%')};
  border-radius: 0;
  overflow: hidden;
  background: rgba(18, 24, 38, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(37, 48, 71, 0.4);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  @media (max-width: ${theme.breakpoints.mobile}) {
    margin-left: 0;
    width: 100%;
    max-width: 100%;
    min-height: 100vh;
  }
`;

// Header component
export const Header = styled('header')`
  padding: 16px 24px;
  background: linear-gradient(135deg, rgba(18, 24, 38, 0.95), rgba(26, 34, 51, 0.9));
  border-bottom: 1px solid rgba(54, 215, 183, 0.15);
  box-shadow: 0 8px 32px rgba(5, 10, 20, 0.3);
  display: flex;
  align-items: center;
  gap: 12px;
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${theme.colors.accentColor}, transparent);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 12px 16px;
    gap: 8px;
  }
`;

export const HeaderContent = styled('div')`
  flex: 1;
  text-align: center;
  position: relative;
  z-index: 2;
`;

export const HeaderTitle = styled('h1')`
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0 0 4px;
  color: ${theme.colors.textPrimary};
  letter-spacing: -0.02em;
  background: linear-gradient(to right, ${theme.colors.textPrimary}, ${theme.colors.accentColor});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 10px rgba(54, 215, 183, 0.1);
`;

export const HeaderSubtitle = styled('p')`
  font-size: 0.95rem;
  color: ${theme.colors.textSecondary};
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.01em;
`;

// Main area component
export const MainArea = styled('main')`
  flex: 1;
  padding: 20px;
  width: 100%;
  max-width: 100%;
  position: relative;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 16px;
  }
`;

// Search container component
export const SearchContainer = styled('div')`
  margin: 8px 0 16px;
  text-align: center;
  width: 100%;
  position: relative;
  z-index: 2;

  @media (max-width: ${theme.breakpoints.mobile}) {
    margin: 6px 0 12px;
  }
`;

// Search input component
export const SearchInput = styled('input')`
  width: 100%;
  max-width: 600px;
  display: block;
  margin: 0 auto;
  padding: 14px 20px 14px 48px;
  font-size: 0.95rem;
  border: 1px solid rgba(54, 215, 183, 0.25);
  border-radius: 50px;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: rgba(18, 24, 38, 0.9);
  color: ${theme.colors.textPrimary};
  font-weight: 500;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    border-color: ${theme.colors.accentColor};
    box-shadow: 0 0 0 3px rgba(54, 215, 183, 0.3), 0 8px 30px rgba(0, 0, 0, 0.2);
    background-color: rgba(26, 34, 51, 0.95);
  }

  &::placeholder {
    color: ${theme.colors.textSecondary};
    opacity: 0.7;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 12px 16px 12px 40px;
    font-size: 0.9rem;
  }
`;

// Tab filter component
export const TabFilter = styled('nav')`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin: 16px 0 24px;
  padding: 0 8px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: 8px;
    margin: 12px 0 20px;
    padding: 0 6px;
  }
`;

export const TabButton = styled('button')<{ isActive: boolean }>`
  padding: 10px 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid ${(props) =>
    props.isActive ? `rgba(54, 215, 183, 0.6)` : `rgba(37, 48, 71, 0.6)`
  };
  border-radius: 50px;
  background: ${(props) =>
    props.isActive ? `rgba(54, 215, 183, 0.15)` : `rgba(18, 24, 38, 0.7)`
  };
  color: ${(props) =>
    props.isActive ? theme.colors.accentColor : theme.colors.textSecondary
  };
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(4px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: 0.5s;
  }

  &:hover {
    background: ${(props) =>
      props.isActive ? `rgba(54, 215, 183, 0.25)` : `rgba(26, 34, 51, 0.8)`
    };
    color: ${(props) =>
      props.isActive ? theme.colors.accentHover : theme.colors.textPrimary
    };
    border-color: rgba(54, 215, 183, 0.8);
    transform: translateY(-2px);

    &::before {
      left: 100%;
    }
  }

  ${(props) => props.isActive ? `
    box-shadow: 0 0 15px rgba(54, 215, 183, 0.2);
  ` : ''}

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
`;

// Cards list component
export const CardsList = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  animation: fadeInUp 0.8s ease-out;
  padding: 0 4px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 0 2px;
  }

  @media (min-width: 768px) and (max-width: 1199px) {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 14px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 18px;
  }
`;

// Card component
export const Card = styled('div')`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${theme.colors.cardBg};
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 6px 15px -5px rgba(0, 0, 0, 0.2), 0 4px 8px -4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid ${theme.colors.cardBorder};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out backwards;
  backdrop-filter: blur(10px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, ${theme.colors.accentColor}, #2f80ed);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-3px);
    background-color: ${theme.colors.cardHover};
    border-color: rgba(54, 215, 183, 0.7);
    box-shadow: 0 12px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 15px -6px rgba(0, 0, 0, 0.2);

    &::before {
      transform: scaleX(1);
    }
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: 10px;
    padding: 14px 16px;
  }
`;

export const CardContent = styled('div')`
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 2;
`;

// Card title component
export const CardTitle = styled('div')`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  z-index: 2;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 0.95rem;
  }
`;

export const CardTag = styled('span')`
  display: inline-block;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${theme.colors.textSecondary};
  background: rgba(17, 24, 39, 0.8);
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid rgba(37, 48, 71, 0.9);
  backdrop-filter: blur(4px);
  font-weight: 600;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 0.65rem;
    padding: 3px 8px;
  }
`;

export const CardArrow = styled('span')`
  font-size: 1.2rem;
  color: rgba(154, 164, 182, 0.7);
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
`;

// No results message component
export const NoResults = styled('div')`
  text-align: center;
  padding: 40px 16px;
  font-size: 1rem;
  color: ${theme.colors.textSecondary};
  background: rgba(18, 24, 38, 0.8);
  border-radius: 16px;
  border: 1px dashed rgba(54, 215, 183, 0.3);
  margin: 16px 0;
  font-weight: 500;
  backdrop-filter: blur(6px);
  animation: fadeInUp 0.6s ease-out;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 30px 12px;
    font-size: 0.95rem;
  }
`;

// Footer component
export const Footer = styled('footer')`
  background-color: ${theme.colors.footerBg};
  background-image: linear-gradient(180deg, rgba(15, 21, 34, 0.95) 0%, ${theme.colors.bgTertiary} 100%);
  padding: 16px 20px;
  border-top: 1px solid rgba(54, 215, 183, 0.15);
  margin-top: auto;
  backdrop-filter: blur(10px);
  text-align: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(54, 215, 183, 0.3), transparent);
  }

  p {
    margin: 0;
    color: ${theme.colors.textSecondary};
    font-size: 0.8rem;
    position: relative;
    z-index: 2;

    @media (max-width: ${theme.breakpoints.mobile}) {
      font-size: 0.75rem;
    }
  }

  code {
    background-color: ${theme.colors.bgTertiary};
    padding: 3px 6px;
    border-radius: 4px;
    font-family: ${theme.typography.mono};
    color: ${theme.colors.accentColor};
    font-size: 0.75em;
    border: 1px solid rgba(54, 215, 183, 0.2);

    @media (max-width: ${theme.breakpoints.mobile}) {
      font-size: 0.7em;
    }
  }
`;

// Sidebar styles
export const Sidebar = styled('aside')<{ isOpen: boolean }>`
  position: fixed;
  left: ${(props) => (props.isOpen ? '0' : '-100%')};
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
    left: ${(props) => (props.isOpen ? '0' : `-${theme.sidebar.widthMobile}`)};
    animation: none;
    left: ${(props) => (props.isOpen ? '0' : '-100%')};
  }

  @media (min-width: ${theme.breakpoints.mobile}) {
    left: 0;
    animation: none;
  }
`;

export const SidebarBackdrop = styled('div')<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;

  @media (min-width: ${theme.breakpoints.mobile}) {
    display: none; /* No backdrop in desktop mode */
  }
`;

export const SidebarHeader = styled('div')`
  padding: 16px 20px;
  border-bottom: 1px solid ${theme.colors.borderColor};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${theme.colors.bgTertiary};
`;

export const SidebarTitle = styled('span')`
  font-weight: 600;
  font-size: 14px;
  color: ${theme.colors.textPrimary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const WindowCount = styled('span')`
  background: ${theme.colors.accentColor};
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
`;

export const SidebarHome = styled('div')`
  padding: 12px;
  border-bottom: 1px solid ${theme.colors.borderColor};
`;

export const HomeButton = styled('button')`
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

export const HomeIcon = styled('span')`
  font-size: 16px;
`;

export const HomeText = styled('span')`
  font-size: 13px;
`;

export const SidebarContent = styled('div')`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
`;

export const NoWindows = styled('div')`
  text-align: center;
  color: ${theme.colors.textSecondary};
  font-size: 13px;
  padding: 20px;
  opacity: 0.7;
`;

export const WindowList = styled('ul')`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const WindowItem = styled('li')<{ isActive: boolean; isMinimized: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 4px;
  background: ${(props) => (props.isActive ? theme.colors.accentColor : theme.colors.cardBg)};
  border: 1px solid ${(props) => (props.isActive ? theme.colors.accentColor : theme.colors.cardBorder)};
  opacity: ${(props) => (props.isMinimized ? 0.7 : 1)};

  &:hover {
    background: ${(props) => (props.isActive ? theme.colors.accentColor : theme.colors.cardHover)};
    border-color: ${theme.colors.accentColor};
  }

  &:hover .window-close {
    opacity: 1;
  }
`;

export const WindowIcon = styled('span')`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
  width: 20px;
  text-align: center;
  flex-shrink: 0;
`;

export const WindowTitle = styled('span')`
  flex: 1;
  font-size: 13px;
  color: ${theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const WindowClose = styled('button')`
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

// Sidebar toggle button component
export const SidebarToggle = styled('button')`
  background: rgba(18, 24, 38, 0.8);
  border: 1px solid rgba(54, 215, 183, 0.35);
  color: ${theme.colors.textPrimary};
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  min-width: 40px;

  &:hover {
    background: rgba(26, 34, 51, 0.9);
    border-color: rgba(54, 215, 183, 0.6);
  }

  /* Hide in desktop mode */
  display: none;

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: block;
    padding: 5px 8px;
    font-size: 11px;
    min-width: 36px;
  }
`;