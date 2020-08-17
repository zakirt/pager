/// <reference types="Cypress" />

describe('Chat room page', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.joinChat('pageruser');
    });

    it('should have the necessary DOM elements on the page', () => {
        cy
            .get('input[placeholder="Message"]')
            .should('be.visible');
        cy
            .get('.btn-send')
            .should('be.visible')
            .should('contain.text', 'Send');
    });

    it('should display the user\'s messages in the message list', () => {
        const message = `Test message ${Date.now()}`;
        cy
            .get('input[placeholder="Message"]')
            .type(`${message}`)
            .get('.btn-send')
            .click();

        cy
            .get('input[placeholder="Message"]')
            .type(`${message}{enter}`)

        cy
            .get('.user-message .message')
            .should('have.length.gte', 1)
            .last()
            .prev()
            .should('contain.text', message)
            .last()
            .should('contain.text', message);
    });
});