const { contextBridge, ipcRenderer } = require('electron');

// This listener will allow us to handle attempts to set
// the given virtual backround
ipcRenderer.on('set-background', (e, arg) => {
  const event = new CustomEvent('set-background', {
    detail: {
      imgPath: arg.imgPath,
    },
  });
  window.dispatchEvent(event);
});

// This listener will facilitate removing any custom background
// from the local participant.
ipcRenderer.on('reset-background', () => {
  window.dispatchEvent(new Event('reset-background'));
});

// Functions which will be exposed to the call window
// renderer process
contextBridge.exposeInMainWorld('api', {
  tryEnableBackgrounds: () => {
    ipcRenderer.invoke('try-enable-backgrounds');
  },
});
