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
});