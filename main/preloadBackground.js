const { contextBridge, ipcRenderer } = require('electron');

// This listener will handle requests to load all background files
// in the background setting window.
ipcRenderer.on('load-backgrounds', (e, arg) => {
  const event = new CustomEvent('load-backgrounds', {
    detail: {
      backgrounds: arg.backgrounds,
    },
  });
  window.dispatchEvent(event);
});

// Functions which will be exposed to the background option
// window renderer process
contextBridge.exposeInMainWorld('api', {
  setBackground: (imgPath) => {
    ipcRenderer.invoke('set-background', imgPath);
  },
  resetBackground: () => {
    ipcRenderer.invoke('reset-background');
  },
});
