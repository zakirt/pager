declare namespace Cypress {
    interface MessageOptions {
        clickSendButton: boolean
    };

    interface Chainable<Subject> {

        /*
         * Signs in user into the chat room.
         * Shoudl be used from the "Join Chat" page.
         * @example
         * cy.joinChat('testuser');
         */
        joinChat(username: string): Chainable<any>

        /*
         * Adds a new user chat message to the message list.
         * Uses ENTER key to insert the message.
         * @example
         * cy.addChatMessage('Hello!');
         */
        enterChatMessage(message: string): Chainable<any>

        /*
         * Adds a new user chat message to the message list.
         * Clicks "Send" button to insert the message.
         * @example
         * cy.addChatMessage('Hello!');
         */
        sendChatMessage(message: string): Chainable<any>
    }
}