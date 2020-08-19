/// <reference types="Cypress" />

describe('Chat join page', () => {
    const sidRegex = /^[-_a-z0-9]{10,50}$/i;

    beforeEach(() =>  cy.visit('/'));

    it('checks for necessary DOM elements for the page and URL', () => {
        cy
            .get('h1')
            .should('be.visible')
            .should('contain.text', 'Join chat');

        cy
            .get('.title')
            .should('be.visible')
            .should('contain.text', 'Please enter your username');

        cy
            .get('.username-input')
            .should('be.visible');

        cy
            .get('.btn')
            .should('be.visible')
            .should('contain.text', 'Next');
        cy
            .url()
            .should('eq', `${Cypress.config().baseUrl}/#/`);
    });

    it('should disable "Next" button until username is filled out', () => {
        cy
            .get('.btn')
            .should('be.disabled')
            .should('have.css', 'background-color', 'rgba(255,130,5, 0.6)');

        cy
            .get('.username-input')
            .type('testuser{enter}')
            .get('.btn')
            .should('not.be.disabled');
    });

    it('should login user into a chat room', () => {
        cy
            .getCookie('io')
            .should('be.null');
        cy.joinChat('pageruser');
        cy
            .getCookie('io')
            .its('value')
            .should('match', sidRegex);
        cy
            .url()
            .should('eq', `${Cypress.config().baseUrl}/#/chat`);
    });
});