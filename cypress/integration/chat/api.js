/// <reference types="Cypress" />

const yeast = require('yeast');

describe('Chat API', () => {
    const username = 'pageruser';
    const sidRegex = /^[-_a-z0-9]{10,50}$/i;

    it('returns socket session', () => {
        getSocketSession()
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
        getSocketSession()
            .then(res => {
                const sid = retrieveSidFromString(res.body);
                return connectUser(sid);
            })
            .then(res => {
                expect(res.status, 'check for green status').to.eq(200);
                expect(res.body).to.contain(`["user-connected","${username}"]`);
            });
    });


    function getSocketSession() {
        const url = createSockerUrl();
        return cy.request(url);
    }

    function connectUser(sid) {
        console.log('sid ', sid);
        const url = createSockerUrl(sid);
        return cy.request(url);
    }

    function createSockerUrl(sid = '') {
        const ts = yeast.encode(Date.now());
        let url = `/socket.io/?username=${username}&EIO=3&transport=polling&t=${ts}`;
        if (sid) {
            url += `&sid=${sid}`;
        }
        return url;
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
});