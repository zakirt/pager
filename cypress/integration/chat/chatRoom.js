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
        cy.sendChatMessage(message);
        cy.enterChatMessage(message);
        cy
            .get('.message-slot')
            .last()
            .then($messageSlot => {
                const $img = $messageSlot.find('.avatar');
                const avatarUrl = 'https://ui-avatars.com/api/?background=eeeeee&color=0f0f0f&name=pageruser';
                expect($img, 'check avatar image').to.have.attr('src', avatarUrl);
                const $icon = $messageSlot.find('.icon-connected');
                expect($icon, 'connected icon should be present').to.have.lengthOf(1);
                const $detail = $messageSlot.find('.detail')
                const detailTimeRegex = /.*\d{1,2}:\d{1,2}\s(pm|am)/;
                expect($detail.text(), 'date/time AM/PM of the message').to.match(detailTimeRegex);
                const $messageLine = $messageSlot.find('.message-line');
                expect($messageLine.length).to.be.gte(2);
                // Using message var here is risky as its value might
                // change by the time this promise resolves
                expect($messageLine.last().prev()).to.contain.text('Test message');
                expect($messageLine.last()).to.contain.text('Test message');
            })
            .get('.message-slot:last')
            .scrollIntoView()
            .should('be.visible')
            .should('contain.text', message);
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
                        expect($slots.length, 'Number of slots should match initial number').to.eq(numSlots);
                    });
            });
    });
});