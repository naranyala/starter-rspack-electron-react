// Import winbox - it sets window.WinBox as a global
import 'winbox/dist/css/winbox.min.css';
import 'winbox/dist/js/winbox.min.js';
import { windowManager } from '../lib/window-manager';

// Get sidebar width from CSS variable or default
function getSidebarWidth(): number {
  // Default sidebar width
  const defaultWidth = 220;

  try {
    // Check if sidebar is open by looking at the App element
    const app = document.querySelector('.App');
    if (app && app.classList.contains('sidebar-open')) {
      // Try to get from CSS variable
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      const sidebarWidth = computedStyle.getPropertyValue('--sidebar-width').trim();
      if (sidebarWidth) {
        return parseInt(sidebarWidth, 10) || defaultWidth;
      }
      return defaultWidth;
    }
    // Sidebar closed, return 0 offset
    return 0;
  } catch (e) {
    return defaultWidth;
  }
}

// Calculate available window area respecting sidebar
function getAvailableWindowArea() {
  const sidebarWidth = getSidebarWidth();
  // Remove padding to make it truly fullscreen
  const padding = 0; // No padding for fullscreen

  const availableWidth = window.innerWidth - sidebarWidth - padding * 2;
  const availableHeight = window.innerHeight - padding * 2;

  return {
    x: sidebarWidth + padding,
    y: padding,
    width: Math.max(availableWidth, 400),
    height: Math.max(availableHeight, 300),
  };
}

function applyWindowArea(winbox: any, area: ReturnType<typeof getAvailableWindowArea>) {
  if (!winbox) return;
  // Prevent recursion by checking if the dimensions are already correct
  if (winbox.width !== area.width || winbox.height !== area.height) {
    winbox.resize(area.width, area.height);
  }
  if (winbox.x !== area.x || winbox.y !== area.y) {
    winbox.move(area.x, area.y);
  }
}

// Shared function to create a WinBox window with consistent styling
export const createWinBoxWindow = ({
  title,
  content,
  width = '500px',
  height = '400px',
  maximize = true, // Default to maximized
}: {
  title: string;
  content: string;
  width?: string;
  height?: string;
  maximize?: boolean;
}) => {
  return new Promise((resolve, reject) => {
    // WinBox is set as a global by the imported script
    const WinBox = (window as any).WinBox;

    if (!WinBox) {
      reject(new Error('WinBox is not loaded'));
      return;
    }

    // Use dark theme for all windows
    const darkThemeBg = '#1a1a2e';
    const darkThemeColor = '#e2e8f0';

    // Calculate position respecting sidebar
    const area = getAvailableWindowArea();

    const winbox = new WinBox({
      title: title,
      html: `<div class="winbox-content"><h3 style="color: ${darkThemeColor};">${title}</h3><div style="color: ${darkThemeColor};" class="winbox-dynamic-content">Loading content...</div></div>`,
      width: maximize ? area.width : width,
      height: maximize ? area.height : height,
      x: maximize ? area.x : 'center',
      y: maximize ? area.y : 'center',
      // Avoid WinBox "max" which ignores sidebar; we simulate maximize via size/position.
      max: false,
      class: ['dark-theme', 'modern', 'custom-styled'],
      background: darkThemeBg,
      border: 2,
    });

    if (maximize) {
      applyWindowArea(winbox, area);
    }

    winbox.onmaximize = () => {
      const maxArea = getAvailableWindowArea();
      applyWindowArea(winbox, maxArea);
      return false;
    };

    // Also handle resize to ensure proper positioning
    winbox.onresize = () => {
      const area = getAvailableWindowArea();
      applyWindowArea(winbox, area);
      return false;
    };

    // Set the content after the window is created
    setTimeout(() => {
      if (winbox && winbox.body) {
        const contentDiv = winbox.body.querySelector('.winbox-dynamic-content');
        if (contentDiv) {
          contentDiv.innerHTML = content;
        } else {
          winbox.body.innerHTML = `<div class="winbox-content"><h3 style="color: ${darkThemeColor};">${title}</h3><div style="color: ${darkThemeColor};">${content}</div></div>`;
        }
      }
    }, 10);

    // Register with window manager
    const windowId = `winbox-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    windowManager.register(windowId, title, winbox);

    resolve(winbox);
  }).catch((error) => {
    console.error('Error creating WinBox window:', error);
    alert(`Failed to create window: ${error.message}`);
    return null;
  });
};
