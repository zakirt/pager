/// <reference types="Cypress" />

describe('Chat room page', () => {
    beforeEach(() => {
        cy.visit('/chat');
    });

    // it('should have all the necessary DOM elements for the page', () => {
    //     cy
    //         .get('.messages')
    //         .should('be.visible')
    //         .should('contain.text', 'Join chat');

    //     cy
    //         .get('.title')
    //         .should('be.visible')
    //         .should('contain.text', 'Please enter your username');

    //     cy
    //         .get('.username-input')
    //         .should('be.visible');

    //     cy
    //         .get('.btn')
    //         .should('be.visible')
    //         .should('contain.text', 'Next');
    // });
});