import { createWinBoxWindow } from '../../utils/winbox-utils';

interface WindowOptions {
  title: string;
  content?: string;
}

export const createElectronPerformanceWindow = async ({ title, content }: WindowOptions) => {
  const performanceContent = `
    <p>Optimizing Electron apps involves reducing memory usage, improving startup time, and efficient resource management. Techniques include code splitting, lazy loading, proper cleanup of event listeners, and optimizing asset loading.</p>
    <p>Monitor performance with Chrome DevTools and consider using native modules for CPU-intensive tasks. Efficient IPC communication also improves responsiveness.</p>
    <h4>Performance Strategies:</h4>
    <ul>
      <li>Minimize main process work</li>
      <li>Optimize renderer process resources</li>
      <li>Efficient IPC communication</li>
      <li>Memory leak prevention</li>
      <li>Asset optimization</li>
    </ul>
    <p>Regular performance monitoring helps maintain a responsive Electron application.</p>
  `;

  return await createWinBoxWindow({
    title,
    content: performanceContent,
    width: '500px',
    height: '400px'
  });
};
