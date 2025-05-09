import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import { StrictMode } from 'react';

import 'destyle.css';
import '@radix-ui/themes/styles.css';

import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme accentColor="indigo" appearance="dark" radius="small">
      <HashRouter>
        <App />
      </HashRouter>
    </Theme>
  </StrictMode>,
);
// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
