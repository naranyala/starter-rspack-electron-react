import { createWinBoxWindow } from '../../utils/winbox-utils';

interface WindowOptions {
  title: string;
  content?: string;
}

export const createElectronNativeApisWindow = async ({ title, content }: WindowOptions) => {
  const nativeApisContent = `
    <p>Electron provides access to native OS features through its APIs: file system operations, dialog boxes, notifications, tray icons, clipboard, and more. These APIs bridge the gap between web technologies and desktop functionality.</p>
    <p>Common native integrations include file dialogs, system notifications, context menus, and deep OS integration for a native-like experience.</p>
    <h4>Common Native APIs:</h4>
    <ul>
      <li>dialog: Show native dialogs</li>
      <li>notification: Display system notifications</li>
      <li>tray: Create system tray icons</li>
      <li>clipboard: Access system clipboard</li>
      <li>shell: Open URLs in default applications</li>
    </ul>
    <p>Using these APIs properly enhances the desktop experience of your Electron application.</p>
  `;

  return await createWinBoxWindow({
    title,
    content: nativeApisContent,
    width: '500px',
    height: '400px'
  });
};
