import { createWinBoxWindow } from '../../utils/winbox-utils';

interface WindowOptions {
  title: string;
  content?: string;
}

export const createElectronIntroWindow = async ({ title, content }: WindowOptions) => {
  const introContent = `
    <p>Electron is a framework for building cross-platform desktop applications using web technologies like HTML, CSS, and JavaScript. It combines the Chromium rendering engine and the Node.js runtime.</p>
    <p>With Electron, you can develop desktop applications that run on Windows, macOS, and Linux using familiar web technologies. Popular applications like Visual Studio Code, Slack, Discord, and WhatsApp Desktop are built with Electron.</p>
    <h4>Key Benefits:</h4>
    <ul>
      <li>Cross-platform compatibility</li>
      <li>Web technology familiarity</li>
      <li>Large ecosystem of libraries</li>
      <li>Active community support</li>
    </ul>
    <p>Getting started with Electron involves understanding the main and renderer processes, which are fundamental to how Electron applications work.</p>
  `;

  return await createWinBoxWindow({
    title,
    content: introContent,
    maximize: true, // Maximize by default, respecting sidebar
  });
};
