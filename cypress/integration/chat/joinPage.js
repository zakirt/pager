/// <reference types="Cypress" />

describe('Chat join page', () => {
    beforeEach(() => {
        cy.visit('/#/chat');
    });

    it('should have all the necessary DOM elements for the page', () => {
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
        cy.joinChat('pageruser');
        cy
            .url()
            .should('eq', `${Cypress.config().baseUrl}/#/chat`);
    });


});