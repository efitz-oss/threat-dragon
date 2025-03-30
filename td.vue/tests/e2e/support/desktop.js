// Support file for Electron desktop testing with Cypress
// This replaces WebdriverIO support functionality

// Import Cypress commands
import './commands';

// Mock Electron API for desktop testing
beforeEach(() => {
  // Create a mock of the window.electronAPI that's provided in the Electron app
  cy.window().then((win) => {
    win.electronAPI = {
      // Mock any Electron IPC methods used by the application
      // These match the methods exposed in preload.js
      openFile: cy.stub().resolves({ filePaths: ['test-file-path.json'] }),
      saveFile: cy.stub().resolves('test-save-path.json'),
      getAppVersion: cy.stub().returns('2.4.1-test'),
      getAppName: cy.stub().returns('OWASP Threat Dragon'),
      getOsVersion: cy.stub().returns('Test OS v1.0'),
      onUpdateDownloaded: cy.stub(),
      quitAndInstall: cy.stub(),
      // Add any other electronAPI methods used by your app
    };

    // Hook into console to help with debugging
    const originalConsoleLog = win.console.log;
    win.console.log = (...args) => {
      originalConsoleLog(...args);
      // You could do additional logging or assertions here
    };
  });
});