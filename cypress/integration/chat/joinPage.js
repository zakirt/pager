/// <reference types="Cypress" />

describe('Chat join page', () => {
    const sidRegex = /^[-_a-z0-9]{10,50}$/i;

    beforeEach(() => {
        cy.server();
        cy
            .route('GET', '/socket.io/*')
            .as('userJoin');
        cy
            .route('GET', '/connected-users')
            .as('userConnected');
        cy.visit('/');
    });

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
            .wait('@userJoin')
            .then(xhr => {
                console.log(xhr);
                expect(xhr.status, 'success status').to.eq(200);
                const queryParams = xhr.url.split('?')[1];
                expect(queryParams, 'username should be in URI string')
                    .to.contain('username=pageruser');
                const body = xhr.response.body.replace(/^[^{]+(.+}).+$/, '$1');
                const res = JSON.parse(body);
                expect(res, 'make sure response has all of the properties')
                    .to.contain.all.keys('sid', 'upgrades', 'pingInterval', 'pingTimeout');
                expect(res.sid, 'valid SID').to.match(sidRegex);
                expect(res.upgrades, 'upgrades property must be an array').to.be.an('Array');
                expect(res.upgrades, 'upgrades must contain "websocket" item')
                    .to.include('websocket');
                expect(res.pingInterval, 'correct ping interval').to.eq(25000);
                expect(res.pingTimeout, 'correct ping timeout').to.eq(5000);
            });
        cy
            .wait('@userConnected')
            .then(conn => {
                expect(conn.status, 'check for green status').to.eq(200);
                const { users } = conn.response.body;
                expect(users, 'array with users is expected').to.be.an('Array');
                expect(users, 'signed in user must be in the list').to.include('pageruser');
            });
        cy
            .getCookie('io')
            .its('value')
            .should('match', sidRegex);
        cy
            .url()
            .should('eq', `${Cypress.config().baseUrl}/#/chat`);
    });
});