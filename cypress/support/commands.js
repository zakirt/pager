// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('joinChat', (username) => {
    cy
        .get('.username-input')
        .type(`${username}{enter}`)
        .get('.btn')
        .click();
});

Cypress.Commands.add('enterChatMessage', (message) => {
    cy
        .get('input[placeholder="Message"]')
        .type(`${message}{enter}`);
});

Cypress.Commands.add('sendChatMessage', (message) => {
    cy
        .get('input[placeholder="Message"]')
        .type(`${message}`)
        .get('.btn-send')
        .click();
});