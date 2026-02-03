import { createWinBoxWindow } from '../../utils/winbox-utils';

interface WindowOptions {
  title: string;
  content?: string;
}

export const createElectronArchitectureWindow = async ({ title, content }: WindowOptions) => {
  const architectureContent = `
    <p>Electron applications have two main processes: the Main Process and the Renderer Process. The Main Process controls the life cycle of the app and creates browser windows. The Renderer Process renders the UI and runs in the browser window.</p>
    <p>Communication between processes happens via IPC (Inter-Process Communication). This architecture allows for secure separation of concerns while maintaining flexibility.</p>
    <h4>Process Types:</h4>
    <ul>
      <li>Main Process: Controls app lifecycle, creates windows</li>
      <li>Renderer Process: Runs in browser windows, handles UI</li>
      <li>Preload Scripts: Bridge between main and renderer</li>
    </ul>
    <p>Understanding this architecture is crucial for building secure and efficient Electron applications.</p>
  `;

  return await createWinBoxWindow({
    title,
    content: architectureContent,
    width: '500px',
    height: '400px'
  });
};
