const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');

let callWindow = null;

// We'll define a custom "img" scheme to fetch images.
// This allows us to load local images without disabling Electron's
// web security, which would be bad.
// Register the scheme as privileged so that the Fetch API
// is allowed to support it.
protocol.registerSchemesAsPrivileged([
  { scheme: 'img', privileges: { supportFetchAPI: true } },
]);

// createCallWindow creates the main application window in which
// the Daily call will be loaded.
function createCallWindow() {
  callWindow = new BrowserWindow({
    width: 800,
    height: 600,
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

app.whenReady().then(() => {
  // Register a custom protocol to fetch our background images
  protocol.registerFileProtocol('img', (request, callback) => {
    const { url } = request;
    // Strip the scheme from the path
    const imgPath = request.url.substring(5, url.length);
    callback({ path: imgPath });
  });
  createCallWindow();
});
