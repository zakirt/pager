/// <reference types="Cypress" />

describe('Chat room page', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.joinChat('pageruser');
    });

    it('checks for necessary DOM elements on the page', () => {
        cy
            .get('input[placeholder="Message"]')
            .should('be.visible');
        cy
            .get('.btn-send')
            .should('be.visible')
            .should('contain.text', 'Send');

        cy
            .get('.btn-logout')
            .should('be.visible')
            .should('contain.text', 'Signout');
    });

    it('should display the user\'s messages in the message list', () => {
        const message = `Test message ${Date.now()}`;
        cy.sendChatMessage(message);
        cy
            .get('.message-slot')
            .last()
            .then(testMessageSlot)
            .get('.message-slot:last')
            .scrollIntoView()
            .should('be.visible')
            .should('contain.text', message);
        cy.enterChatMessage('Test message');
        cy
            .get('.message-slot')
            .last()
            .then(testMessageSlot)
            .get('.message-slot:last')
            .scrollIntoView()
            .should('be.visible')
            .should('contain.text', 'Test message');
    });

    it('adds GIF image when /gif command is used inside message', () => {
        cy.enterChatMessage('/gif <img src"">');
        cy
            .get('.message-slot')
            .last()
            .then(testMessageSlot)
            .get('.message-slot:last')
            .scrollIntoView()
            .get('.gif')
            .then($gif => {
                const giphyUrlRegex = /https:\/\/media\d\.giphy\.com\/media\/.+/
                expect($gif.attr('src'), 'make sure it is using Giphy URL').to.match(giphyUrlRegex);
            });
    });

    it('should not add empty messages', () => {
        cy
            .get('.message-slot')
            .then($messageSlots => {
                const numSlots = $messageSlots.length;
                expect(numSlots, 'Intitial number of slots').to.be.gte(1);
                cy.sendChatMessage(' ');
                cy
                    .get('.message-slot')
                    .then($slots => {
                        expect($slots.length, 'Number of slots should match initial number')
                            .to.eq(numSlots);
                    });
            });
    });

    it('should display note when typing a new message', () => {
        cy.typeChatMessage('This is a test message');
        cy
            .get('.users-typing')
            .should('be.visible')
            .should('contain.text', 'You are typing');
    });

    // it('logs out user user and redirect to the join page', () => {
    //     cy
    //         .get('.btn-logout')
    //         .click();
    //     cy
    //         .getCookie('io')
    //         .should('be.null');
    //     cy
    //         .url()
    //         .should('eq', Cypress.config().baseUrl);
    // });

    function testMessageSlot($messageSlot) {
        const $img = $messageSlot.find('.avatar');
        const apiUrl = Cypress.env('avatarApiUrl');
        const avatarUrl = `${apiUrl}?background=eeeeee&color=0f0f0f&name=pageruser`;
        expect($img, 'check avatar image').to.have.attr('src', avatarUrl);
        const $icon = $messageSlot.find('.icon-connected');
        expect($icon, 'connected icon should be present').to.have.lengthOf(1);
        const $detail = $messageSlot.find('.detail')
        const detailTimeRegex = /.*\d{1,2}:\d{1,2}\s(pm|am)/;
        expect($detail.text(), 'date/time AM/PM of the message').to.match(detailTimeRegex);
        const $messageLine = $messageSlot.find('.message-line');
        expect($messageLine.length).to.be.gte(1);
    }
});