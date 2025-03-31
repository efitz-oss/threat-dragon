'use strict';

// Import electron directly to expose the full module
const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain, protocol, dialog } = electron;
const path = require('path');
const url = require('url');
const fs = require('fs');
const os = require('os');
const electronLog = require('electron-log');
const { autoUpdater } = require('electron-updater');

// Configure logging
electronLog.transports.file.level = 'info';
electronLog.info('Application starting...');

// Keep a global reference of the window object
let mainWindow;

// We'll use a simplified menu first
const getMenuTemplate = () => {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          click() {
            openFile();
          }
        },
        {
          label: 'Save',
          click() {
            saveFile();
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      role: 'editMenu'
    },
    {
      label: 'View',
      role: 'viewMenu'
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click() {
            showAbout();
          }
        }
      ]
    }
  ];

  return template;
};

// Helper function to open files
async function openFile() {
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Threat Models', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0];
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Send to renderer
      mainWindow.webContents.send('open-model', path.basename(filePath), JSON.parse(fileContent));
      return filePath;
    }
  } catch (error) {
    electronLog.error('Error opening file:', error);
    dialog.showErrorBox('Error Opening File', error.message);
  }
  return null;
}

// Helper function to save files
async function saveFile(content, suggestedFileName) {
  try {
    const result = await dialog.showSaveDialog({
      defaultPath: suggestedFileName || 'threat-model.json',
      filters: [
        { name: 'Threat Models', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    
    if (!result.canceled) {
      fs.writeFileSync(result.filePath, content);
      return result.filePath;
    }
  } catch (error) {
    electronLog.error('Error saving file:', error);
    dialog.showErrorBox('Error Saving File', error.message);
  }
  return null;
}

// Show about dialog
function showAbout() {
  dialog.showMessageBox(mainWindow, {
    title: 'About OWASP Threat Dragon',
    message: 'OWASP Threat Dragon',
    detail: `Version: ${app.getVersion()}\nElectron: ${process.versions.electron}\nChrome: ${process.versions.chrome}\nNode.js: ${process.versions.node}\nV8: ${process.versions.v8}\nOS: ${os.type()} ${os.release()} ${os.arch()}`
  });
}

function createWindow() {
  // Create the browser window
  electronLog.info('Creating browser window');
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.resolve(__dirname, 'simple-preload.js'),
      webSecurity: false, // For local development
      allowRunningInsecureContent: true // Only for development
    }
  });
  
  // Log any window errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    electronLog.error(`Page failed to load: ${errorDescription} (${errorCode})`);
  });
  
  mainWindow.webContents.on('crashed', () => {
    electronLog.error('Renderer process crashed');
  });
  
  mainWindow.on('unresponsive', () => {
    electronLog.error('Window became unresponsive');
  });

  // Set up the menu
  const menu = Menu.buildFromTemplate(getMenuTemplate());
  Menu.setApplicationMenu(menu);

  // Only show window when ready
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
    mainWindow.focus();
    electronLog.info('Window loaded and shown');
  });
  
  // Listen for console logs from the renderer
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    const levels = ['debug', 'info', 'warning', 'error'];
    const logLevel = levels[level] || 'info';
    
    if (logLevel === 'debug') {
      electronLog.debug(`Console message from renderer: ${message}`);
    } else if (logLevel === 'info') {
      electronLog.info(`Console message from renderer: ${message}`);
    } else if (logLevel === 'warning') {
      electronLog.warn(`Console message from renderer: ${message}`);
    } else if (logLevel === 'error') {
      electronLog.error(`Console message from renderer: ${message}`);
    } else {
      electronLog.info(`Console message from renderer: ${message}`);
    }
  });

  // In development mode, use the live development server
  if (process.env.NODE_ENV === 'development' && process.env.WEBPACK_DEV_SERVER_URL) {
    electronLog.info('Running in development mode with URL: ' + process.env.WEBPACK_DEV_SERVER_URL);
    mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the bundled index.html
    try {
      // Check if file exists before loading
      const indexPath = path.join(__dirname, 'index.html');
      if (fs.existsSync(indexPath)) {
        electronLog.info(`index.html exists at ${indexPath}`);
      } else {
        electronLog.error(`index.html NOT found at ${indexPath}`);
        // List files in the directory
        const files = fs.readdirSync(__dirname);
        electronLog.info(`Files in directory: ${files.join(', ')}`);
      }
      
      // Open dev tools to help debug the issue
      mainWindow.webContents.openDevTools();
      
      const startUrl = url.format({
        pathname: indexPath,
        protocol: 'file:',
        slashes: true
      });
      
      electronLog.info(`Attempting to load app from ${startUrl}`);
      mainWindow.loadURL(startUrl);
      electronLog.info(`Loading command sent for ${startUrl}`);
    } catch (error) {
      electronLog.error('Error loading app:', error);
      
      // Try loading from the current directory as a fallback
      try {
        electronLog.info('Trying fallback with direct HTML content');
        mainWindow.webContents.loadURL(`data:text/html,
          <html>
          <head>
            <title>OWASP Threat Dragon - Error</title>
            <style>
              body { font-family: sans-serif; padding: 20px; background: #f5f5f5; }
              h1 { color: #cc0000; }
            </style>
          </head>
          <body>
            <h1>Error Loading Application</h1>
            <p>There was an error loading the application. Please check the logs.</p>
            <pre>${error.toString()}</pre>
          </body>
          </html>
        `);
      } catch (fallbackError) {
        electronLog.error('Fallback page also failed:', fallbackError);
      }
    }
  }

  // Set up IPC handlers
  setupIPC();

  // Set up auto-updater events
  setupAutoUpdater();
}

function setupIPC() {
  // Handle IPC events from renderer to main
  ipcMain.on('app-close', () => {
    app.quit();
  });

  // Handle file operations
  ipcMain.handle('open-file', openFile);
  ipcMain.handle('save-file', (event, content, suggestedFileName) => {
    return saveFile(content, suggestedFileName);
  });

  // Handle app info requests
  ipcMain.handle('get-app-version', () => app.getVersion());
  ipcMain.handle('get-app-name', () => app.getName());
  ipcMain.handle('get-os-version', () => `${os.type()} ${os.release()}`);
}

function setupAutoUpdater() {
  autoUpdater.logger = electronLog;
  autoUpdater.logger.transports.file.level = 'info';
  
  autoUpdater.on('checking-for-update', () => {
    electronLog.info('Checking for updates...');
  });
  
  autoUpdater.on('update-available', (info) => {
    electronLog.info('Update available:', info);
    mainWindow.webContents.send('update-available', info);
  });
  
  autoUpdater.on('update-downloaded', (info) => {
    electronLog.info('Update downloaded:', info);
    mainWindow.webContents.send('update-downloaded', info);
  });
  
  autoUpdater.on('error', (err) => {
    electronLog.error('AutoUpdater error:', err);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  // Register app:// protocol for loading the app in production
  protocol.registerFileProtocol('app', (request, callback) => {
    const url = request.url.substr(6); // strip app:// 
    callback({ path: path.normalize(`${__dirname}/${url}`) });
  });
  
  createWindow();
  
  // In this file you can include the rest of your app's specific main process code
  electronLog.info('App is ready, window created');

  // Check for updates right when the app launches
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    electronLog.info('Checking for updates...');
    autoUpdater.checkForUpdatesAndNotify()
      .catch(err => electronLog.error('Error checking for updates:', err));
  }
  
  app.on('activate', () => {
    // On macOS it's common to re-create a window when the dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle quit and install on auto-update
ipcMain.on('quit-and-install', () => {
  autoUpdater.quitAndInstall();
});

// Log any unhandled errors
process.on('uncaughtException', (error) => {
  electronLog.error('Uncaught exception:', error);
});