// Cypress configuration for desktop Electron testing
// This replaces the WebdriverIO tests for the desktop application

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  fixturesFolder: 'tests/e2e/fixtures',
  screenshotsFolder: 'tests/e2e/screenshots',
  videosFolder: 'tests/e2e/videos',
  e2e: {
    setupNodeEvents(on, config) {
      // We can implement Electron-specific event handling here
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'electron') {
          // Modify Electron browser configuration as needed
          launchOptions.args = [
            ...launchOptions.args,
            '--app=dist-desktop', // Point to the Electron app
          ];
          return launchOptions;
        }
      });
    },
    specPattern: 'tests/e2e/desktop/**/*.cy.js',
    supportFile: 'tests/e2e/support/desktop.js',
    baseUrl: 'app://./index.html',
    experimentalInteractiveRunEvents: true, // Enable interactive run events
    experimentalStudio: true,
  },
  env: {
    isElectron: true,
  },
});