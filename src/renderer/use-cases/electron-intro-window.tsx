import React from 'react';
import WinBox from 'winbox/src/js/winbox';
import { generateTheme } from '../window-generator';

interface WindowOptions {
  title: string;
  content?: string;
}

export const createElectronIntroWindow = ({ title, content }: WindowOptions) => {
  const windowTheme = generateTheme(title);

  const winbox = new WinBox({
    title: title,
    html: `<div class="winbox-content"><h3 style="color: ${windowTheme.color};">${title}</h3><div style="color: ${windowTheme.color};" class="winbox-dynamic-content">Loading content...</div></div>`,
    width: '500px',
    height: '400px',
    x: 'center',
    y: 'center',
    class: 'modern',
    background: windowTheme.bg,
    border: 4,
  });

  // Set the content after the window is created
  setTimeout(() => {
    if (winbox && winbox.body) {
      const contentDiv = winbox.body.querySelector('.winbox-dynamic-content');
      if (contentDiv) {
        contentDiv.innerHTML = `
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
      } else {
        winbox.body.innerHTML = `<div class="winbox-content"><h3 style="color: ${windowTheme.color};">${title}</h3><div style="color: ${windowTheme.color};">
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
        </div></div>`;
      }
    }
  }, 10);

  return winbox;
};