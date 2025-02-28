/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import * as localforage from 'localforage';
import { isElectron } from '../core/handleElectron';
import TailwindModal from './TailwindModel/TailwindModal';

const AutoUpdate = () => {
  const [message, setMessage] = useState(null);
  const [version, setVersion] = useState('');
  const [notification, setNotification] = useState(false);
  const [restartButton, setRestartButton] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState();

  useEffect(() => {
        localforage.setItem('font-family', global.fonts);
        const electron = window.require('electron');
        const { ipcRenderer } = electron;
          ipcRenderer.send('app_version');
          ipcRenderer.on('app_version', (event, arg) => {
            ipcRenderer.removeAllListeners('app_version');
            setVersion(`Version ${ arg.version}`);
            // eslint-disable-next-line no-console
            console.log(arg.version);
            localforage.setItem('userPath', arg.appPath);
            localStorage.setItem('userPath', arg.appPath);
          });

          ipcRenderer.on('update_available', () => {
            ipcRenderer.removeAllListeners('update_available');
            setMessage('A new autographa update is available. Downloading now...');
            setNotification(true);
          });

          ipcRenderer.on('download-progress', (event, text) => {
            ipcRenderer.removeAllListeners('download-progress');
            setDownloadProgress(text);
            setNotification(true);
          });

          ipcRenderer.on('update_downloaded', () => {
            ipcRenderer.removeAllListeners('update_downloaded');
            setMessage('Update Downloaded. It will be installed on restart. Restart now?');
            setRestartButton(true);
            setNotification(true);
          });
  });

  function closeNotification() {
    setNotification(false);
  }

  function restartApp() {
    if (isElectron()) {
    const electron = window.require('electron');
    const { ipcRenderer } = electron;
    ipcRenderer.send('restart_app');
    }
  }
  const actionButtons = (
    <>
      {restartButton && (
      <button
        type="button"
        style={{ background: '#5F9EA0', color: 'white' }}
        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
        onClick={restartApp}
      >
        Restart
      </button>
    )}
      <button
        type="button"
        style={{ background: '#778899', color: 'white' }}
        className="ml-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
        onClick={closeNotification}
      >
        Close
      </button>
      {/* <button id="close-button" type="button" onClick={closeNotification}>
          Close
        </button>
        {restartButton && (
          <button id="restart-button" type="button" onClick={restartApp}>
          Restart
        </button> */}
      {/* )} */}
    </>
  );
  return (
    <>
      <TailwindModal
        isOpen={notification}
        setIsOpen={setNotification}
        title="Autographa Update!"
        message={message}
        actionButtons={actionButtons}
      />
      {/* <div id="notification">
        <p>
          {message}
        </p>
        {actionButtons}
      </div> */}
      {/* <p id="version"></p>
      <div id="notification" class="hidden">
        <p id="message"></p>
        <button id="close-button" onClick={closeNotification}>
          Close
        </button>
        <button id="restart-button" onClick={restartApp} className="hidden">
          Restart
        </button>
      </div> */}
    </>
  );
};

export default AutoUpdate;
