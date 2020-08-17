declare namespace Cypress {
    interface Chainable<Subject> {

        /*
         * Signs in user into the chat room.
         * Shoudl be used from the "Join Chat" page.
         * @example
         * cy.joinChat('testuser');
         */
        joinChat(username: string): Chainable<any>
    }
}