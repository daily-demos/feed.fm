const { app, BrowserWindow, ipcMain, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

let callWindow = null;

// All loaded background file paths
const backgroundFiles = [];

// Whether all backgrounds file paths have been loaded
let backgroundsLoaded = false;

// Whether the call object is ready to accept background
// setting API requests.
let callObjectReady = false;

// Whether the backgrounds window is open
let backgroundsWindowOpen = false;

// We'll define a custom "bg" scheme to fetch our background images.
// This allows us to load local images without disabling Electron's
// web security, which would be bad.
// Register the scheme as privileged so that the Fetch API
// is allowed to support it.
protocol.registerSchemesAsPrivileged([
  { scheme: 'bg', privileges: { supportFetchAPI: true } },
]);

// createCallWindow creates the main application window in which
// the Daily call will be loaded.
function createCallWindow() {
  callWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preloadCall.js'),
    },
    autoHideMenuBar: true,
  });

  // If the user closes the main call window, exit
  // the entire application even if the background
  // options window is still open.
  callWindow.on('close', () => {
    callWindow = null;
    app.quit();
  });
  callWindow.loadFile(
    path.join(__dirname, '../renderer', 'call', 'index.html')
  );
}

// loadBackgroundFiles loads all jpg, jpeg, or png files in
// the backgrounds file directory. This means to add a new
// background, all the user has to do is drop the image into
// the "backgrounds" folder, without any code changes.
async function loadBackgroundFiles() {
  const dirPath = path.join(__dirname, '../backgrounds');
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error('failed to load background files', err);
      return;
    }
    files.forEach((file) => {
      const ext = path.extname(file);
      if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
        return;
      }

      const imgPath = path.join(dirPath, file);
      backgroundFiles.push(imgPath);
    });
  });

  backgroundsLoaded = true;
  tryEnableBackgroundSet();
}

app.whenReady().then(() => {
  // Register a custom protocol to fetch our background images
  protocol.registerFileProtocol('bg', (request, callback) => {
    const { url } = request;
    // Strip the scheme from the path
    const imgPath = request.url.substring(5, url.length);
    callback({ path: imgPath });
  });
  createCallWindow();
  loadBackgroundFiles();
});

// createBackgroundSelectionWindow creates a window in which the user
// can select a Daily video call background to set.
function createBackgroundSelectionWindow() {
  if (backgroundsWindowOpen) return;

  backgroundsWindowOpen = true;

  const win = new BrowserWindow({
    width: 500,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preloadBackground.js'),
    },
    autoHideMenuBar: true,
  });

  win.loadFile(
    path.join(__dirname, '../renderer', 'background', 'background.html')
  );

  win.webContents.once('dom-ready', () => {
    win.webContents.send('load-backgrounds', { backgrounds: backgroundFiles });
  });

  win.on('close', () => {
    backgroundsWindowOpen = false;
  });
}

// "set-background" event handler instructs the daily renderer
// process to set the given background for the local participant.
ipcMain.handle('set-background', (e, imgPath) => {
  callWindow.webContents.send('set-background', {
    imgPath,
  });
});

// "reset-background" event handler instructs the daily renderer
// process to reset any custom backgrounds for the local participant.
ipcMain.handle('reset-background', () => {
  callWindow.webContents.send('reset-background');
});

// "try-enable-backgrounds" event handler will mark the call object
// as ready to accept background effects, and attempts to enable
// the background setting option menu.
ipcMain.handle('try-enable-backgrounds', () => {
  callObjectReady = true;
  tryEnableBackgroundSet();
});

// tryEnableBackgroundSet enables the background option menu item
// if all backgrounds have been successfully loaded and the call
// object is ready.
function tryEnableBackgroundSet() {
  if (backgroundsLoaded && callObjectReady) {
    // When first enabling the feature, open the window for
    // the user. After that, the user will use the menu item
    // to change their background.
    createBackgroundSelectionWindow();
  }
}
