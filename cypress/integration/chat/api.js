/// <reference types="Cypress" />

const yeast = require('yeast');

describe('Chat API', () => {
    const sidRegex = /^[-_a-z0-9]{10,50}$/i;

    it('returns socket session', () => {
        getSocketSession('pageruser')
            .then(res => {
                expect(res.status, 'check for green status').to.eq(200);
                const { body } = res;
                const sid = retrieveSidFromString(body);
                expect(sid, 'valid SID expected').to.match(sidRegex);
                const resObj = retrieveObjectFromSocketResponse(body);
                expect(resObj, 'make sure response has all of the properties')
                    .to.contain.all.keys('sid', 'upgrades', 'pingInterval', 'pingTimeout');
                expect(resObj.sid, 'valid SID').to.match(sidRegex);
                expect(resObj.upgrades, 'upgrades property must be an array').to.be.an('Array');
                expect(resObj.upgrades, 'upgrades must contain "websocket" item')
                    .to.include('websocket');
                expect(resObj.pingInterval, 'correct ping interval').to.eq(25000);
                expect(resObj.pingTimeout, 'correct ping timeout').to.eq(5000);
            });
    });

    it('returns confirmation that user with specified SID is connected', () => {
        const username = 'pageruser';
        getSocketSession(username)
            .then(res => retrieveSidAndConnectUser(res.body, username))
            .then(res => {
                expect(res.status, 'check for green status').to.eq(200);
                expect(res.body).to.contain(`["user-connected","${username}"]`);
            });
    });

    it('retrieves a list of connected users', () => {
        const user1 = 'pageruser';
        getSocketSession(user1)
            .then(res => retrieveSidAndConnectUser(res.body, user1))
            .then(listConnectedUsers)
            .then(res => testConnectedUsersListResponse(res, user1));
        const user2 = 'testuser';
        getSocketSession(user2)
            .then(res => retrieveSidAndConnectUser(res.body, user2))
            .then(listConnectedUsers)
            .then(res => testConnectedUsersListResponse(res, user2));
    });

    function getSocketSession(username) {
        const url = createSocketUrl(username);
        return cy.request(url);
    }

    function connectUser(username, sid) {
        const url = createSocketUrl(username, sid);
        return cy.request(url);
    }

    function listConnectedUsers() {
        const url = '/connected-users';
        return cy.request(url);
    }

    function createSocketUrl(username, sid = '') {
        const ts = yeast.encode(Date.now());
        let url = `/socket.io/?username=${username}&EIO=3&transport=polling&t=${ts}`;
        if (sid) {
            url += `&sid=${sid}`;
        }
        return url;
    }

    function testConnectedUsersListResponse(res, username) {
        expect(res.status, 'check for green status').to.eq(200);
        const { users } = res.body;
        expect(users, 'users must be an array').to.be.an('Array');
        expect(users, 'must include the connected user').to.include(username);
    }

    function retrieveSidFromString(responseStr) {
        const sidRetrievalRegex = /.+"sid":"(.+)",.+/;
        return responseStr.replace(sidRetrievalRegex, '$1');
    }

    function retrieveObjectFromSocketResponse(resStr) {
        const joinResponseObjectRegex = /^[^{]+(.+}).+$/;
        const objStr = resStr.replace(joinResponseObjectRegex, '$1');
        return JSON.parse(objStr);
    }

    function retrieveSidAndConnectUser(str, username) {
        const sid = retrieveSidFromString(str);
        return connectUser(username, sid);
    }
});