import { createWinBoxWindow } from '../../utils/winbox-utils';

interface WindowOptions {
  title: string;
  content?: string;
}

export const createElectronDevelopmentWindow = async ({ title, content }: WindowOptions) => {
  const developmentContent = `
    <p>Effective Electron development involves using tools like Hot Module Replacement (HMR), development servers, and proper debugging setups. Use electron-reload for automatic restarts during development.</p>
    <p>Separate development and production configurations, implement proper error handling, and use build tools to automate repetitive tasks for a smooth development experience.</p>
    <h4>Development Tools:</h4>
    <ul>
      <li>Hot Module Replacement (HMR)</li>
      <li>Development servers</li>
      <li>Debugging tools</li>
      <li>Build automation</li>
      <li>Testing frameworks</li>
    </ul>
    <p>A well-configured development environment significantly improves productivity.</p>
  `;

  return await createWinBoxWindow({
    title,
    content: developmentContent,
    width: '500px',
    height: '400px'
  });
};
