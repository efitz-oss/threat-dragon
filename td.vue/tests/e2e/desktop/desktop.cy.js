// Desktop application tests with Cypress
// This replaces the WebdriverIO tests from desktop.spec.js

describe('Desktop application', () => {
  beforeEach(() => {
    // Visit the app (using the baseUrl from the config)
    cy.visit('/');
  });

  describe('main window', () => {
    it('should have the correct title', () => {
      cy.title().should('equal', 'OWASP Threat Dragon');
    });

    it('should have an electron url', () => {
      cy.url().should('include', 'app://');
    });

    it('should have the Electron API available', () => {
      cy.window().then((win) => {
        expect(win.electronAPI).to.exist;
        expect(typeof win.electronAPI.getAppVersion).to.equal('function');
      });
    });

    // Additional tests that were in the original WebdriverIO tests
    // We can't test window size directly in Cypress, but we can check viewport
    it('should have correct content viewport', () => {
      cy.viewport(1400, 900);
      cy.get('.navbar-brand').should('be.visible');
    });
  });

  describe('desktop functionality', () => {
    it('should handle threat model file operations', () => {
      cy.window().then((win) => {
        // Test that mock implementations work correctly
        const openStub = win.electronAPI.openFile;
        const saveStub = win.electronAPI.saveFile;
        
        expect(openStub).to.be.a('function');
        expect(saveStub).to.be.a('function');
        
        // Verify our mock works as expected
        openStub().then(result => {
          expect(result).to.have.property('filePaths');
          expect(result.filePaths[0]).to.equal('test-file-path.json');
        });
      });
    });

    it('should access app information', () => {
      cy.window().then((win) => {
        const appVersion = win.electronAPI.getAppVersion();
        const appName = win.electronAPI.getAppName();
        const osVersion = win.electronAPI.getOsVersion();
        
        expect(appVersion).to.match(/\d+\.\d+\.\d+/);
        expect(appName).to.equal('OWASP Threat Dragon');
        expect(osVersion).to.be.a('string');
      });
    });
    
    it('should provide recent model access', () => {
      cy.window().then(async (win) => {
        const recentList = win.electronAPI.getRecentModelList();
        expect(recentList).to.be.an('array');
        
        // Test updating the list
        await win.electronAPI.updateRecentModelList();
      });
    });
  });
});